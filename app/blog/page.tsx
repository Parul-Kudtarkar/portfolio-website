import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Headphones } from "lucide-react"
import { format } from "date-fns"
import { CnnDnaAnimation } from "@/components/blog/cnn-dna-animation"

const ALPHAGENOME_PART1_SLUG = "understanding-alphagenome-part-1-biology-problem"

export const metadata = {
  title: 'Blog | Parul Kudtarkar',
  description: 'Insights about AI, disease etiology and cure',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="typography-page-title">Blog</h1>
          <p className="typography-body mx-auto max-w-2xl">
            Insights about AI, disease etiology and cure
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  {post.slug === ALPHAGENOME_PART1_SLUG ? (
                    <div className="relative h-32 w-full overflow-hidden border-b border-border bg-gradient-to-b from-muted/50 to-background">
                      <div
                        className="pointer-events-none absolute left-1/2 top-1/2 w-max"
                        style={{ transform: "translate(-50%, -50%) scale(0.38)" }}
                        aria-hidden
                      >
                        <CnnDnaAnimation variant="card" />
                      </div>
                    </div>
                  ) : (
                    post.image && (
                      <div className="w-full h-32 overflow-hidden border-b border-border bg-muted/30">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      )}
                      {post.featured && (
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {post.audioUrl && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Headphones className="h-3 w-3" />
                          Listen
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="typography-content-title line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="typography-body line-clamp-3 mt-2">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="typography-meta flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      )}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center text-primary text-[14px] font-normal group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <p className="typography-content-title" role="heading" aria-level={2}>
              No posts yet
            </p>
            <p className="typography-body max-w-md">
              Blog posts will appear here once they're published.
            </p>
          </div>
        )}

        {/* Categories and Tags Section */}
        {(categories.length > 0 || tags.length > 0) && (
          <div className="mt-16 pt-12 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.length > 0 && (
                <div>
                  <p className="typography-section-label" role="heading" aria-level={3}>
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {tags.length > 0 && (
                <div>
                  <p className="typography-section-label" role="heading" aria-level={3}>
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
