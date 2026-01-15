export default function DashboardPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="container">
                <div className="text-center py-20">
                    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
                    <p className="text-muted-foreground mb-8">
                        Track your applications, contributions, and achievements
                    </p>
                    <div className="glass-dark border border-primary/20 rounded-xl p-12 max-w-2xl mx-auto">
                        <p className="text-lg mb-4">🔐 Authentication Required</p>
                        <p className="text-muted-foreground">
                            Sign in with GitHub to access your personalized dashboard
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
