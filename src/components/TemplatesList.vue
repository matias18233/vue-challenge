<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { getTemplates } from '../services/templateService'

  const templates = ref([])

  onMounted(async () => {
    try {
      const data = await getTemplates()
      templates.value = data.data
      console.log('Templates recibidos:', JSON.stringify(templates.value, null, 2))
    } catch (error) {
      console.error('Error al cargar templates:', error)
    }
  })

  function highlightVariables(text: string): string {
    return text.replace(/\{\{(.*?)\}\}/g, '<span class="text-blue-600 font-bold">{{ $1 }}</span>')
  }

  function visibleButtons(buttons: any[]): any[] {
    return buttons.slice(0, 2)
  }
</script>
<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--Modificar según tamaño de pantalla-->
    <div v-if="templates.length === 0" class="text-gray-500">
      Cargando templates...
    </div>

    <div v-for="(template, index) in templates" :key="index" class="border p-4 rounded bg-white shadow">
      <!--
      <div class="mt-4 border rounded p-3 bg-gray-50">
        <p class="text-sm text-gray-600">Header: {{ template.components.header?.content }}</p>
        <p class="text-sm text-gray-600">Body: {{ template.components.body?.content }}</p>
        <p class="text-sm text-gray-600">Footer: {{ template.components.footer }}</p>
        <p class="text-sm text-gray-600">Botones: {{ template.components.buttons?.length }}</p>
      </div>
      -->
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
</template>
<style>
</style>