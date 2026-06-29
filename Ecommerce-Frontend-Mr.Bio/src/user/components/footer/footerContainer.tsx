import { Facebook, Instagram } from "lucide-react";
import mrBioLogo from "../../../assets/icon/mrbiologo.png";
import tiktok from "../../../assets/icon/tiktok.png";
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t bg-white">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16">
                {/* Top Section: Logo left + Links right */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 py-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-4 max-w-sm">
                        <a href="/" className="flex items-center gap-3 group">
                            <img
                                src={mrBioLogo}
                                alt="MrBio Logo"
                                className="h-10 w-10 rounded-xl ring-1 ring-gray-200 object-contain group-hover:scale-105 transition"
                                loading="lazy"
                            />
                            <span className="text-lg font-semibold tracking-tight">MrBio</span>
                        </a>
                        <p className="text-sm text-gray-600 leading-6">
                            Building products that connect people with knowledge. Simple, fast, and delightful.
                        </p>
                        <p className="text-xs text-gray-500">© {year} MrBio. All Rights Reserved.</p>
                    </div>

                    {/* Links */}
                    <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li><a href="/home/our-products" className="text-gray-600 hover:text-gray-900 transition">Overview</a></li>
                                <li><a href="/home/our-products" className="text-gray-600 hover:text-gray-900 transition">Pricing</a></li>

                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li><a href="/home/about-us" className="text-gray-600 hover:text-gray-900 transition">About us</a></li>
                                <li><a href="/home/our-blogs" className="text-gray-600 hover:text-gray-900 transition">Blog</a></li>

                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                            <ul className="mt-3 space-y-2 text-sm">
                                <li>Call us at +977-9801030766</li>
                            </ul>
                        </div>
                    </nav>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-200" />

                {/* Bottom Bar: Socials left + Legal right */}
                <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.facebook.com/share/1ApPSMPiEb/"
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="Facebook"
                            className="rounded-xl p-2 ring-1 ring-gray-200 hover:ring-gray-300 transition"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a
                            href="https://www.instagram.com/mrbionpl?igsh=MW1xOTVxamg0aXU3dg=="
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="Instagram"
                            className="rounded-xl p-2 ring-1 ring-gray-200 hover:ring-gray-300 transition"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@mrbionpl?is_from_webapp=1&sender_device=pc"
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="GitHub"
                            className="rounded-xl p-2 ring-1 ring-gray-200 hover:ring-gray-300 transition"
                        >
                            <img
                                src={tiktok}
                                alt="TikTok"
                                className="h-5 w-5"

                            />
                        </a>
                    </div>

                    {/* Legal */}
                    <div className="text-xs text-gray-500">
                        <p>Crafted by <a href="https://moonlightcreativesnepal.com/" className="text-gray-600 hover:text-gray-900 transition" target="_blank" rel="noreferrer noopener">Moonlight Creatives</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
