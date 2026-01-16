'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t glass-dark backdrop-blur-xl mt-20">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <h3 className="font-bold text-lg mb-4">
                            GSoC<span className="text-primary">Hub</span>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Your companion for discovering and tracking Google Summer of Code projects.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/projects" className="hover:text-primary transition-colors">
                                    Browse Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/matcher" className="hover:text-primary transition-colors">
                                    AI Project Matcher
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="https://summerofcode.withgoogle.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    Official GSoC Site
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://developers.google.com/open-source/gsoc/faq"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    GSoC FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/subhranshudash13-dotcom/GSOC-contributor-hub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="GitHub Repository"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} GSoC Contributor Hub. Built for the community.</p>
                </div>
            </div>
        </footer>
    )
}
