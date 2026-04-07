import { useState, useEffect, useRef } from "react"
import {
    ArrowLeft,
    Users,
    Lock,
    Globe,
    Search,
    X,
    Shield,
    Trophy,
    Loader2,
    Camera,
    ImageIcon,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn, resolvePostImageUrl } from "@/lib/utils"
import { toast } from "sonner"
import { createSquadSchema, type CreateSquadFormData } from "@/lib/validations/forms"
import { sportService } from "@/lib/services/sport"
import { userService } from "@/lib/services/user"
import { squadService } from "@/lib/services/squad"
import { authService } from "@/lib/services/auth"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CreateSquadPageProps {
    onNavigate: (page: PageRoute) => void
}

export function CreateSquadPage({ onNavigate }: CreateSquadPageProps) {
    const [sports, setSports] = useState<any[]>([])
    const [people, setPeople] = useState<any[]>([])
    const [formData, setFormData] = useState({
        name: "",
        sport: "",
        description: "",
        maxMembers: "20",
    })
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateSquadFormData, string>>>({})
    const [submitting, setSubmitting] = useState(false)
    const [privacy, setPrivacy] = useState<"public" | "private">("public")
    const [invitedPeople, setInvitedPeople] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingCover, setUploadingCover] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sportsData, usersData] = await Promise.allSettled([
                    sportService.getAll(),
                    userService.browseUsers(),
                ])
                if (sportsData.status === "fulfilled") setSports(Array.isArray(sportsData.value) ? sportsData.value : [])
                if (usersData.status === "fulfilled") setPeople(Array.isArray(usersData.value) ? usersData.value : [])
            } catch (error) {
                console.error("Failed to load data", error)
            }
        }
        loadData()
    }, [])

    const filteredPeople = people.filter(
        (p: any) =>
            (p.name || `${p.firstName || ''} ${p.lastName || ''}`).toLowerCase().includes(searchQuery.toLowerCase()) &&
            !invitedPeople.includes(p.id)
    )

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setCoverFile(file)
        setCoverPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
        setFieldErrors({})
        const result = createSquadSchema.safeParse({
            name: formData.name,
            sport: formData.sport,
            description: formData.description,
            maxMembers: formData.maxMembers,
        })
        if (!result.success) {
            const err: Partial<Record<keyof CreateSquadFormData, string>> = {}
            result.error.errors.forEach((e) => {
                const key = e.path[0] as keyof CreateSquadFormData
                if (key && !err[key]) err[key] = e.message
            })
            setFieldErrors(err)
            return
        }
        const sport = sports.find((s: { id: string }) => s.id === result.data.sport)
        const user = authService.getCurrentUser()
        const captainDisplayName =
            user && (user as { firstName?: string; lastName?: string }).firstName != null
                ? `${(user as { firstName?: string }).firstName ?? ""} ${(user as { lastName?: string }).lastName ?? ""}`.trim()
                : (user as { name?: string })?.name
        setSubmitting(true)
        try {
            let logoUrl: string | undefined
            let coverImage: string | undefined

            if (logoFile) {
                setUploadingLogo(true)
                const res = await squadService.uploadLogo(logoFile)
                logoUrl = res.url
                setUploadingLogo(false)
            }
            if (coverFile) {
                setUploadingCover(true)
                const res = await squadService.uploadCover(coverFile)
                coverImage = res.url
                setUploadingCover(false)
            }

            const squad = await squadService.create({
                name: result.data.name,
                description: result.data.description || undefined,
                sportId: result.data.sport,
                sportName: sport?.name,
                captainDisplayName: captainDisplayName || undefined,
                maxMembers: result.data.maxMembers ?? 20,
                logoUrl,
                coverImage,
            })

            if (invitedPeople.length > 0 && squad?.id) {
                const addResults = await Promise.allSettled(
                    invitedPeople.map((userId) => {
                        const person = people.find((p: any) => p.id === userId)
                        const userName = person
                            ? (person.name || `${person.firstName || ""} ${person.lastName || ""}`.trim())
                            : undefined
                        return squadService.addMember(squad.id, { userId, userName, role: "Member" })
                    })
                )
                const failed = addResults.filter((r) => r.status === "rejected").length
                if (failed > 0) toast.info(`${invitedPeople.length - failed} invited, ${failed} failed`)
            }

            toast.success("Squad created successfully!")
            onNavigate("community")
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Could not create squad")
        } finally {
            setSubmitting(false)
            setUploadingLogo(false)
            setUploadingCover(false)
        }
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => onNavigate("community")}
                    className="rounded-full p-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Create Squad</h1>
                    <p className="text-sm text-muted-foreground">
                        Build your sports team and invite members
                    </p>
                </div>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div
                    className="relative h-32 bg-gradient-to-br from-[#003C66] to-[#005A99] cursor-pointer"
                    onClick={() => coverInputRef.current?.click()}
                >
                    {coverPreview ? (
                        <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center gap-2 text-white/70">
                            <ImageIcon className="h-5 w-5" />
                            <span className="text-xs font-medium">Add cover image</span>
                        </div>
                    )}
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                </div>
                <div className="p-5">
                <h3 className="mb-4 text-sm font-bold text-foreground">Squad Identity</h3>
                <div className="flex items-center gap-5 mb-4">
                    <div
                        className="relative h-20 w-20 shrink-0 cursor-pointer"
                        onClick={() => logoInputRef.current?.click()}
                    >
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="h-20 w-20 rounded-2xl object-cover shadow-lg" />
                        ) : (
                            <div className="gradient-secondary flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-lg">
                                <Shield className="h-8 w-8" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
                            <Camera className="h-3 w-3" />
                        </div>
                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
                    </div>
                    <div className="flex-1 space-y-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                Squad Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFieldErrors((p) => ({ ...p, name: undefined })) }}
                                placeholder="e.g., Thunder Hawks"
                                className={cn("h-11 w-full rounded-xl border bg-muted px-4 text-sm outline-none focus:border-primary", fieldErrors.name ? "border-red-400" : "border-border")}
                            />
                            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">Sport</label>
                    <Select
                        value={formData.sport}
                        onValueChange={(val) => { setFormData({ ...formData, sport: val }); setFieldErrors((p) => ({ ...p, sport: undefined })) }}
                    >
                        <SelectTrigger className={cn("h-11 w-full rounded-xl border bg-muted px-4 text-sm", fieldErrors.sport ? "border-red-400" : "border-border")}>
                            <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                        <SelectContent>
                            {sports.map((sport: { id: string; name: string }) => (
                                <SelectItem key={sport.id} value={sport.id}>
                                    {sport.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {fieldErrors.sport && <p className="mt-1 text-xs text-red-500">{fieldErrors.sport}</p>}
                </div>
                </div>
            </div>

            {/* Description & Settings */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What's your squad about? Goals, vibe, schedule..."
                            rows={3}
                            className="w-full resize-none rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                            Max Members
                        </label>
                        <input
                            type="number"
                            value={formData.maxMembers}
                            onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                            className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Privacy */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Privacy</h3>
                <div className="grid grid-cols-2 gap-3">
                    {([
                        { id: "public" as const, label: "Public", desc: "Anyone can find and join", icon: Globe },
                        { id: "private" as const, label: "Private", desc: "Invite only", icon: Lock },
                    ]).map((option) => (
                        <button
                            type="button"
                            key={option.id}
                            onClick={() => setPrivacy(option.id)}
                            className={cn(
                                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                                privacy === option.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted"
                            )}
                        >
                            <option.icon
                                className={cn(
                                    "h-6 w-6",
                                    privacy === option.id ? "text-primary" : "text-muted-foreground"
                                )}
                            />
                            <p className="text-xs font-semibold text-foreground">{option.label}</p>
                            <p className="text-[10px] text-muted-foreground text-center">{option.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Invite Members */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Invite Members
                    {invitedPeople.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {invitedPeople.length}
                        </span>
                    )}
                </h3>

                {/* Invited chips */}
                {invitedPeople.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {invitedPeople.map((id) => {
                            const person = people.find((p) => p.id === id)
                            return person ? (
                                <div
                                    key={id}
                                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1"
                                >
                                    <span className="text-xs font-medium text-primary">{person.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setInvitedPeople((prev) => prev.filter((p) => p !== id))}
                                    >
                                        <X className="h-3 w-3 text-primary" />
                                    </button>
                                </div>
                            ) : null
                        })}
                    </div>
                )}

                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search people to invite..."
                        className="h-10 w-full rounded-xl border border-border bg-muted pl-9 pr-4 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div className="max-h-48 space-y-1 overflow-y-auto">
                    {filteredPeople.slice(0, 6).map((person) => (
                        <button
                            type="button"
                            key={person.id}
                            onClick={() => setInvitedPeople((prev) => [...prev, person.id])}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                        >
                            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
                                {person.avatar}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-foreground">{person.name}</p>
                                <p className="text-[11px] text-muted-foreground">
                                    {person.sport} • {person.location}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onNavigate("community")}
                    className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => void handleSubmit()}
                    className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                    {submitting
                        ? uploadingLogo ? "Uploading logo…" : uploadingCover ? "Uploading cover…" : "Creating…"
                        : "Create Squad"}
                </button>
            </div>
        </div>
    )
}
