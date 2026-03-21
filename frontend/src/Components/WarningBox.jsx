function WarningBox({ warnings, onConfirm, onCancel, confirmLabel = "Proceed Anyway" }) {
    if (!warnings || warnings.length === 0) return null;

    return (
        <div className="bg-amber-400/5 border border-amber-400/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400 text-lg">⚠</span>
                <p className="text-amber-400 font-semibold text-sm">Requirements not met</p>
            </div>
            <div className="space-y-2 mb-4">
                {warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {w}
                    </div>
                ))}
            </div>
            <div className="flex gap-3">
                {onConfirm && (
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-lg text-sm transition-colors"
                    >
                        {confirmLabel}
                    </button>
                )}
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white rounded-lg text-sm transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

export default WarningBox;