import { Link } from 'react-router-dom'

type MdxModule = {
    default: React.ComponentType
    frontmatter?: {
        title?: string
        date?: string
        description?: string
        slug?: string
    }
}

const modules = import.meta.glob('../content/blog/*.mdx', { eager: true }) as Record<string, MdxModule>

const posts = Object.entries(modules)
    .map(([path, mod]) => {
        const fm = mod.frontmatter ?? {}
        const fallbackSlug = path.split('/').pop()!.replace(/\.mdx?$/, '')
        return {
            slug: fm.slug || fallbackSlug,
            title: fm.title || fallbackSlug,
            date: fm.date || '',
            description: fm.description || '',
        }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

export default function Blog() {
    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-black mb-12">blog</h1>

                <div className="space-y-8">
                    {/* External digital garden link remains at top */}
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

                    {posts.map((p) => (
                        <div key={p.slug} className="border-b border-gray-200 pb-6">
                            <h3 className="text-xl font-semibold text-black mb-2">
                                <Link to={`/blog/${p.slug}`} className="hover:underline">
                                    {p.title}
                                </Link>
                            </h3>
                            {p.date && <p className="text-black text-sm">{p.date}</p>}
                            {p.description && <p className="text-black mt-2">{p.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}