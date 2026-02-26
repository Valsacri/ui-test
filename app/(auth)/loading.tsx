export default function AuthLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#003C66] to-[#005A9E]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
            </div>
        </div>
    )
}
