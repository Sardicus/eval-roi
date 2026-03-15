import React, { useState, useEffect, useRef, useCallback } from "react";

export default function PriceFilter({
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    min = 0,
    max = 50000000,
}) {
    const [localMin, setLocalMin] = useState(minPrice ?? min);
    const [localMax, setLocalMax] = useState(maxPrice ?? max);
    const trackRef = useRef(null);
    const dragging = useRef(null);

    useEffect(() => {
        setLocalMin(minPrice ?? min);
        setLocalMax(maxPrice ?? max);
    }, [minPrice, maxPrice]);

    const getPercent = (value) => ((value - min) / (max - min)) * 100;

    const getValueFromClientX = useCallback((clientX) => {
        const track = trackRef.current;
        if (!track) return min;
        const rect = track.getBoundingClientRect();
        const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const raw = min + percent * (max - min);
        return Math.round(raw / 100000) * 100000;
    }, [min, max]);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragging.current) return;
            const val = getValueFromClientX(e.clientX);
            if (dragging.current === "min") {
                setLocalMin(prev => Math.min(val, prev === localMax ? localMax - 100000 : localMax - 100000));
            } else {
                setLocalMax(prev => Math.max(val, localMin + 100000));
            }
        };

        const onMouseUp = () => { dragging.current = null; };
        const onTouchMove = (e) => {
            if (!dragging.current) return;
            const val = getValueFromClientX(e.touches[0].clientX);
            if (dragging.current === "min") {
                setLocalMin(Math.min(val, localMax - 100000));
            } else {
                setLocalMax(Math.max(val, localMin + 100000));
            }
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onMouseUp);
        };
    }, [localMin, localMax, getValueFromClientX]);

    const handleTrackClick = useCallback((e) => {
        if (dragging.current) return;
        const val = getValueFromClientX(e.clientX);
        const distToMin = Math.abs(val - localMin);
        const distToMax = Math.abs(val - localMax);
        if (distToMin <= distToMax) {
            setLocalMin(Math.min(val, localMax - 100000));
        } else {
            setLocalMax(Math.max(val, localMin + 100000));
        }
    }, [localMin, localMax, getValueFromClientX]);

    const minPercent = getPercent(localMin);
    const maxPercent = getPercent(localMax);

    return (
        <div className="p-4 bg-[#0f172a] border border-[#334155] rounded-xl flex flex-col gap-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">Price Range</label>

            {/* Slider track area */}
            <div className="relative" style={{ height: "32px", margin: "0 11px" }}>

                {/* Clickable track */}
                <div
                    ref={trackRef}
                    onClick={handleTrackClick}
                    className="absolute rounded-full cursor-pointer"
                    style={{
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: "6px",
                        transform: "translateY(-50%)",
                        background: "#1e293b",
                        border: "1px solid #334155",
                    }}
                />

                {/* Amber fill */}
                <div
                    className="absolute pointer-events-none rounded-full"
                    style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                        height: "6px",
                        background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    }}
                />

                {/* Min thumb */}
                <div
                    onMouseDown={(e) => { e.preventDefault(); dragging.current = "min"; }}
                    onTouchStart={() => { dragging.current = "min"; }}
                    className="absolute rounded-full cursor-grab active:cursor-grabbing"
                    style={{
                        width: "22px",
                        height: "22px",
                        top: "50%",
                        left: `${minPercent}%`,
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        border: "3px solid #f59e0b",
                        boxShadow: "0 0 0 3px rgba(245,158,11,0.2), 0 2px 6px rgba(0,0,0,0.5)",
                        zIndex: 5,
                    }}
                />

                {/* Max thumb */}
                <div
                    onMouseDown={(e) => { e.preventDefault(); dragging.current = "max"; }}
                    onTouchStart={() => { dragging.current = "max"; }}
                    className="absolute rounded-full cursor-grab active:cursor-grabbing"
                    style={{
                        width: "22px",
                        height: "22px",
                        top: "50%",
                        left: `${maxPercent}%`,
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        border: "3px solid #f59e0b",
                        boxShadow: "0 0 0 3px rgba(245,158,11,0.2), 0 2px 6px rgba(0,0,0,0.5)",
                        zIndex: 5,
                    }}
                />
            </div>

            {/* Track labels */}
            <div className="flex justify-between text-xs text-[#64748b] -mt-2">
                <span>₺{min.toLocaleString()}</span>
                <span>₺{max.toLocaleString()}</span>
            </div>

            {/* Inputs + Apply */}
            <div className="flex gap-2 items-center">
                <div className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2">
                    <p className="text-xs text-[#64748b] mb-0.5">Min</p>
                    <input
                        type="text"
                        value={localMin === min ? "" : localMin.toLocaleString("tr-TR")}
                        onChange={(e) => setLocalMin(Number(e.target.value.replace(/[^\d]/g, "")) || min)}
                        placeholder="Any"
                        className="w-full bg-transparent text-white text-sm font-semibold outline-none placeholder-[#64748b]"
                    />
                </div>
                <span className="text-[#334155] text-lg">—</span>
                <div className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2">
                    <p className="text-xs text-[#64748b] mb-0.5">Max</p>
                    <input
                        type="text"
                        value={localMax === max ? "" : localMax.toLocaleString("tr-TR")}
                        onChange={(e) => setLocalMax(Number(e.target.value.replace(/[^\d]/g, "")) || max)}
                        placeholder="Any"
                        className="w-full bg-transparent text-white text-sm font-semibold outline-none placeholder-[#64748b]"
                    />
                </div>
                <button
                    onClick={() => { setMinPrice(localMin); setMaxPrice(localMax); }}
                    className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-lg text-sm transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}