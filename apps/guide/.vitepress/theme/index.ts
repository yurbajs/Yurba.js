// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './clean-style.css'
import HeroActions from './components/HeroActions.vue'
import SimpleHero from './components/SimpleHero.vue'
import MyLayout from './MyLayout.vue'

export default {
  extends: DefaultTheme,
  // Layout: MyLayout,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('HeroActions', HeroActions)
    app.component('SimpleHero', SimpleHero)
    
    // Автоматичне розгортання активних розділів sidebar
    if (typeof window !== 'undefined') {
      const expandActiveSections = () => {
        setTimeout(() => {
          const collapsibleSections = document.querySelectorAll('.VPSidebarItem.collapsible')
          
          collapsibleSections.forEach(section => {
            const activeLink = section.querySelector('.items .link.active')
            if (activeLink) {
              const details = section.querySelector('details')
              if (details && !details.open) {
                details.open = true
              }
            }
          })
        }, 100)
      }
      
      // Розгорнути при зміні маршруту
      router.onAfterRouteChanged = expandActiveSections
      
      // Розгорнути при завантаженні
      document.addEventListener('DOMContentLoaded', expandActiveSections)
      setTimeout(expandActiveSections, 300)
    }
  }
} satisfies Theme
