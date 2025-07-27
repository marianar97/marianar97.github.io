export default function Blog() {
    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-black mb-12">blog</h1>
                
                <div className="space-y-8">
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-xl font-semibold text-black mb-2">
                            <a 
                                href="https://garden.marianar.tech" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                My digital garden: a place to grow
                            </a>
                        </h3>
                        <p className="text-black text-sm">2025-07-27</p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}