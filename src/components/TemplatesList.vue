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
    return text.replace(
      /\{\{(.*?)\}\}/g,
      `<span class="bg-[#EDF2F7] text-[#39A16B] px-1.5 py-0.5 rounded font-semibold text-xs whitespace-nowrap"> $1 </span>`
    )
  }

  function visibleButtons(buttons: any[]): any[] {
    return buttons.slice(0, 2)
  }

  function handleScroll() {
    const scrollTop = window.scrollY
    const viewportHeight = window.innerHeight
    const fullHeight = document.documentElement.scrollHeight

    const isNearBottom = scrollTop + viewportHeight >= fullHeight - 100

    if (isNearBottom) {
      loadTemplates()
    }
  }

  function getStatusBadge(status: string): { bg: string, text: string, icon: string, color: string } {
    const upper = status?.toUpperCase()

    switch (upper) {
      case 'PENDING':
        return {
          bg: '#C6F6D5',
          color: '#5CAC89',
          icon: '📶',
          text: 'Active - Pending'
        }
      case 'REJECTED':
        return {
          bg: '#FED7D7',
          color: '#D55F5F',
          icon: '⛔',
          text: 'Rejected'
        }
      case 'APPROVED':
        return {
          bg: '#BEE3F8',
          color: '#3182CE',
          icon: '✅',
          text: 'Approved'
        }
      case 'DRAFT':
        return {
          bg: '#FEEBCB',
          color: '#D69E2E',
          icon: '✏️',
          text: 'Draft'
        }
      default:
        return {
          bg: '#E2E8F0',
          color: '#4A5568',
          icon: '❓',
          text: 'Unknown'
        }
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
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div v-if="templates.length === 0" class="text-gray-500">
      Loading templates...
    </div>

    <div class="border shadow bg-[#E2E8F0] flex flex-col justify-between overflow-hidden" style="aspect-ratio: 1 / 1">
      <div class="text-center font-bold text-sm py-2 border-b" style="border-color: #D6DADE">
        Create new template
      </div>
      <div class="flex-grow flex items-center justify-center">
        <a href="#" class="w-14 h-14 rounded-full bg-[#0083FF] flex items-center justify-center text-white text-2xl hover:scale-105 transition">
          +
        </a>
      </div>
      <div class="text-center text-[11px] text-[#81859A] underline py-2">
        <a href="#">Create new from our library →</a>
      </div>
    </div>
    <div
      v-for="(template, index) in templatesFiltrados"
      :key="index"
      class="border shadow bg-white flex flex-col overflow-hidden"
      style="aspect-ratio: 1 / 1"
    >
      <!-- Header -->
      <div class="bg-[#E2E8F0] px-4 py-2 flex justify-between items-start shrink-0 border-b" style="border-color: #D6DADE;">
        <div class="flex flex-col">
          <div class="text-sm font-semibold text-gray-800 leading-snug">
            {{ template.components.header?.content || 'No header content' }}
          </div>
          <div class="mt-1">
            <div
              v-if="template.status"
              class="flex items-center text-[11px] px-2 py-0.5 rounded-md font-medium w-fit"
              :style="{ backgroundColor: getStatusBadge(template.status).bg, color: getStatusBadge(template.status).color }"
            >
              <span>{{ getStatusBadge(template.status).icon }}</span>
              <span class="ml-1">{{ getStatusBadge(template.status).text }}</span>
            </div>
          </div>
        </div>

        <div class="flex space-x-1 mt-2">
          <button class="bg-white text-gray-700 text-xs px-2 py-1 rounded shadow-sm hover:bg-gray-100">
            View
          </button>
          <button class="bg-white text-gray-700 text-xs px-2 py-1 rounded shadow-sm hover:bg-gray-100">
            ⋮
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="bg-[#EDF2F7] px-4 py-3 text-sm text-gray-800 border-l border-r border-[#E2E8F0] overflow-y-auto flex-grow">
        <div class="relative w-2/3 max-w-full self-start mt-2">
          <!-- Piquito -->
          <div
            class="absolute -left-2 top-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white"
          ></div>

          <!-- Mensaje y botones -->
          <div class="bg-white p-3 rounded-lg shadow-sm whitespace-pre-line flex flex-col gap-2">
            <!-- Texto -->
            <span v-html="highlightVariables(template.components.body.content)"></span>

            <!-- Botones -->
            <div v-if="template.components.buttons?.length">
              <button
                v-for="(btn, i) in visibleButtons(template.components.buttons)"
                :key="btn.id"
                class="w-full bg-white text-[#358CD4] text-xs px-3 py-1 border-t border-b border-[#F4F7FA] flex justify-center items-center gap-1 hover:bg-[#F9FAFB] transition"
              >
                <span>↩</span>
                <span>{{ btn.text }}</span>
              </button>

              <button
                v-if="template.components.buttons.length > 2"
                class="w-full text-[#358CD4] text-xs px-3 py-1 border-t border-b border-[#F4F7FA] flex justify-center items-center gap-1 hover:underline"
              >
                <span>Explorar más</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-[#E2E8F0] px-4 py-2 text-xs text-gray-600 border-t flex justify-between items-center shrink-0">
        <span class="bg-[#EDF2F7] text-gray-700 text-[11px] px-2 py-0.5 rounded-md font-medium">
          {{ template.language || 'en' }}
        </span>
        <span>6 May</span>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="text-center text-gray-500 py-4">
    Loading more templates...
  </div>
</template>

<style>
</style>