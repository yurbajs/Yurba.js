<script setup>
import { useData } from 'vitepress'
import links from '../../links.json'

const { isDark } = useData()
</script>

<template>
  <div class="VPHero">
    <div class="container">
      <div class="actions">
          <div class="action">
            <a class="Button medium brand" href="/start">
              <span class="text">Guide</span>
            </a>
          </div>
          <div class="action">
            <a class="Button medium alt" :href="links.docs">
              <span class="text">Documentation</span>
            </a>
          </div>
          <div class="action">
            <a class="Button medium" :href="links.npm">
              <img src="/icons/npm.svg" width="16" height="16" style="margin-right: 8px;" alt="NPM">
              <span class="text">NPM</span>
            </a>
          </div>
          <div class="action">
            <a class="Button medium" :href="links.github">
              <img :src="isDark ? '/icons/github-mark-white.svg' : '/icons/github-mark.svg'" width="16" height="16" style="margin-right: 8px;" alt="GitHub">
              <span class="text">Github</span>
            </a>
          </div>
          <div class="action">
            <a class="Button medium" :href="links.yurba">
            <img :src="isDark ? '/icons/yurba.svg' : '/icons/yurba-blue.svg'" width="16" height="16" style="margin-right: 8px;" class="yurba-icon" alt="Yurba">
              <span class="text">Yurba</span>
            </a>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
@import './HeroActions.css';
</style>