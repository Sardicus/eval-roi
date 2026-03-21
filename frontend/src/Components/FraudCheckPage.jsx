import React, { useState } from "react";
import FraudAnalysisCard from "../Components/FraudAnalysisCard";

export default function FraudCheckPage() {
  const token   = localStorage.getItem("token");
  const headers = { "Authorization": `Bearer ${token}` };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sahtecilik Analizi</h1>
          <p className="text-[#64748b]">
            Sahibinden, Hürriyet Emlak vb. platformlardaki ilan metnini yapıştırın — sistemimiz olası dolandırıcılık işaretlerini tespit eder.
          </p>
        </div>

        <FraudAnalysisCard headers={headers} />

      </div>
    </div>
  );
}