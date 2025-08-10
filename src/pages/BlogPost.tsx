import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'

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

export default function BlogPost() {
    const { slug = '' } = useParams()

    const entry = useMemo(() => {
        for (const [path, mod] of Object.entries(modules)) {
            const fm = mod.frontmatter ?? {}
            const fallbackSlug = path.split('/').pop()!.replace(/\.mdx?$/, '')
            const s = fm.slug || fallbackSlug
            if (s === slug) return { Component: mod.default, frontmatter: fm }
        }
        return null
    }, [slug])

    if (!entry) {
        return (
            <div className="min-h-screen bg-white p-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-black">Post not found.</p>
                    <Link to="/blog" className="text-blue-600 underline">Back to blog</Link>
                </div>
            </div>
        )
    }

    const { Component, frontmatter } = entry

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/blog" className="text-blue-600 underline">← Back</Link>
                <h1 className="text-4xl font-bold text-black mt-6">{frontmatter?.title}</h1>
                {frontmatter?.date && <p className="text-black text-sm mt-2">{frontmatter.date}</p>}
                <div className="prose prose-neutral max-w-none mt-8">
                    <Component />
                </div>
            </div>
        </div>
    )
}


