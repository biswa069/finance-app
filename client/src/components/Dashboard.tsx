import React, { useState } from 'react';
import { useTransactions, useUploadCSV, useInsights } from '../hooks/useTransactions';
// 1. IMPORT THE CHART COMPONENT
import CategoryChart from './CategoryChart';

const Dashboard: React.FC = () => {
    const { data: transactions, isLoading } = useTransactions();
    const uploadMutation = useUploadCSV();
    const insightMutation = useInsights();
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        uploadMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-4">Loading data...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">💰 AI Finance Manager</h2>

            {/* SECTION 1: UPLOAD (Full Width) */}
            <div className="card p-4 mb-4 shadow-sm">
                <h3>1. Upload CSV</h3>
                <div className="input-group">
                    <input 
                        type="file" 
                        className="form-control"
                        accept='.csv' 
                        onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    />
                    <button 
                        className="btn btn-primary" 
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending}
                    >
                        {uploadMutation.isPending ? 'Processing...' : 'Upload'}
                    </button>
                </div>
                {uploadMutation.isSuccess && <small className="text-success mt-2">✅ Upload successful!</small>}
            </div>

            {/* SECTION 2: AI INSIGHTS & CHART (Side-by-Side) */}
            <div className="row mb-4">
                {/* Left Column: AI Advisor */}
                <div className="col-md-6 mb-3">
                    <div className="card p-4 h-100 shadow-sm">
                        <h3>2. AI Advisor</h3>
                        <p className="text-muted">Get intelligent budget advice based on your spending.</p>
                        
                        <button 
                            className="btn btn-success w-100 mb-3" 
                            onClick={() => insightMutation.mutate()}
                            disabled={insightMutation.isPending}
                        >
                            {insightMutation.isPending ? 'Analyzing with Gemini...' : 'Get AI Insights'}
                        </button>

                        {insightMutation.data && (
                            <div className="alert alert-info">
                                <p className="mb-2"><strong>💡 Budget:</strong> {insightMutation.data.budget_suggestion}</p>
                                <p className="mb-0"><strong>💰 Tip:</strong> {insightMutation.data.tip}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: The Chart (INSERTED HERE) */}
                <div className="col-md-6 mb-3">
                    <CategoryChart transactions={transactions || []} />
                </div>
            </div>

            {/* SECTION 3: TRANSACTIONS LIST */}
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h3 className="h5 mb-0">3. Recent Transactions</h3>
                </div>
                <ul className="list-group list-group-flush">
                    {transactions?.map(t => (
                        <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span className="fw-bold">{t.description}</span>
                                <br />
                                <small className="text-muted">{new Date(t.date).toLocaleDateString()} • {t.category}</small>
                            </div>
                            <span className={t.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                {t.type === 'income' ? '+' : ''}{t.amount}
                            </span>
                        </li>
                    ))}
                    {transactions?.length === 0 && (
                        <li className="list-group-item text-center text-muted">No transactions found. Upload a file!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;