<script setup lang="ts">
  import { onMounted, ref,onBeforeUnmount, computed } from 'vue'
  import { getTemplates } from '../services/templateService'

  const templates = ref([])
  const page = ref(1)
  const isLoading = ref(false)
  const hasMore = ref(true)
  const filtroStatus = ref('ALL')

  onMounted(async () => {
    try {
      loadTemplates()
      window.addEventListener('scroll', handleScroll)
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  async function loadTemplates() {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true

    try {
      const data = await getTemplates(page.value)
      const newTemplates = data.data
      
      console.log('Templates received:', JSON.stringify(data.data, null, 2)) // BORRAR

      if (newTemplates.length === 0) {
        hasMore.value = false
      } else {
        templates.value.push(...newTemplates)
        page.value++
      }
    } catch (err) {
      console.error('Error loading more templates:', err)
    } finally {
      isLoading.value = false
    }
  }

  const templatesFiltrados = computed(() => {
    if (filtroStatus.value === 'ALL') {
      return templates.value
    }

    return templates.value.filter(t => t.status?.toUpperCase() === filtroStatus.value.toUpperCase())
  })

  function highlightVariables(text: string): string {
    return text.replace(/\{\{(.*?)\}\}/g, '<span class="text-blue-600 font-bold">{{ $1 }}</span>')
  }

  function visibleButtons(buttons: any[]): any[] {
    return buttons.slice(0, 2)
  }

  function handleScroll() {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100

    if (bottom) {
      loadTemplates()
    }
  }
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">Filter by status::</label>
    <select v-model="filtroStatus" class="border border-gray-300 rounded px-3 py-2 text-sm">
      <option value="ALL">All</option>
      <option value="APPROVED">Approved</option>
      <option value="PENDING">Pending</option>
      <option value="REJECTED">Rejected</option>
      <option value="draft">Draft</option>
    </select>
  </div>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--Modificar según tamaño de pantalla-->
    <div v-if="templates.length === 0" class="text-gray-500">
      Loading templates...
    </div>

    <div v-for="(template, index) in templatesFiltrados" :key="index" class="border p-4 rounded bg-white shadow">
      <!--
      <div class="mt-4 border rounded p-3 bg-gray-50">
        <p class="text-sm text-gray-600">Header: {{ template.components.header?.content }}</p>
        <p class="text-sm text-gray-600">Body: {{ template.components.body?.content }}</p>
        <p class="text-sm text-gray-600">Footer: {{ template.components.footer }}</p>
        <p class="text-sm text-gray-600">Botones: {{ template.components.buttons?.length }}</p>
      </div>
      -->
      <!--BORRAR-->
      <div class="mt-4 border rounded p-3 bg-gray-50">
        <div v-if="template.components.header?.content" class="font-semibold border-b pb-2 mb-2">
          {{ template.components.header.content }}
        </div>

        <div class="mb-2 whitespace-pre-line">
          <span v-html="highlightVariables(template.components.body.content)"></span>
        </div>

        <div v-if="template.components.footer" class="text-sm text-gray-600 border-t pt-2 mt-2 italic">
          {{ template.components.footer }}
        </div>
      </div>
      <!--
      <p class="font-bold text-lg">{{ template.name }}</p>
      <p class="text-sm text-gray-600">Estado: {{ template.status }}</p>
      <p class="text-sm text-gray-600">Idioma: {{ template.language }}</p>
      -->
      <!--BORRAR-->
      <div v-if="template.components.buttons?.length" class="mt-3 space-y-1">
        <ul class="text-sm list-disc list-inside">
          <li v-for="(btn, i) in visibleButtons(template.components.buttons)" :key="btn.id">
            {{ btn.text }}
          </li>
          <li v-if="template.components.buttons.length > 2" class="text-blue-600 cursor-pointer">
            Explorar más
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="text-center text-gray-500 py-4">
    Loading more templates...
  </div>
</template>
<style>
</style>