<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { getTemplates } from '../services/templateService'

  const templates = ref([])

  onMounted(async () => {
    try {
      const data = await getTemplates()
      templates.value = data
      console.log('Templates recibidos:', templates.value)
    } catch (error) {
      console.error('Error al cargar templates:', err)
    }
  })
</script>
<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--Modificar según tamaño de pantalla-->
    <div v-if="templates.length === 0" class="text-gray-500">
      Cargando templates...
    </div>

    <div v-for="(template, index) in templates" :key="index" class="border p-4 rounded bg-white shadow">
      <p class="font-bold text-lg">{{ template.name }}</p>
      <p class="text-sm text-gray-600">Estado: {{ template.status }}</p>
      <p class="text-sm text-gray-600">Idioma: {{ template.language }}</p>
    </div>
  </div>
</template>
<style>
</style>