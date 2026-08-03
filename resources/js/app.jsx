import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

createInertiaApp({
    id: "audiobook-app",
    strictMode: true,
    title: (title) => title ? `${title} - Audiobook App` : 'Audiobook App',
    resolve: name => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx', { eager: true })
    ),
    setup({ el, App, props }) {
        if (el) {
            createRoot(el).render(<App {...props} />)
            return
        }

        return <App {...props} />
    },
})
