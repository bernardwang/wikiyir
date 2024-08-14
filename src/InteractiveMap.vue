<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>

  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import axios from 'axios';

  export default defineComponent({
    setup() {
      const mapContainer = ref<HTMLDivElement | null>(null);
      const topArticlesByCountry: Record<string, string> = {};

      // Mapping from country to their primary Wikipedia language edition
      const countryLanguageMapping = {
        'Brazil': 'pt',
        'USA': 'en',
        'South Africa': 'en',
        'Australia': 'en',
        'France': 'fr',
        'India': 'en',
        'Vietnam': 'vi',
      };

      const fetchTopArticle = async (language: string) => {
        try {
          const response = await axios.get(
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${language}.wikipedia.org/all-access/2024/08/01`
          );
          const topArticle = response.data.items[0].articles[0];
          return topArticle;
        } catch (error) {
          console.error(`Failed to fetch top article for ${language}:`, error);
          return { article: 'No Data', views: 0 };
        }
      };

      onMounted(async () => {
        if (mapContainer.value) {
          // Initialize the map
          const map = L.map(mapContainer.value).setView([20, 0], 2); // Centered on the world

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          // Fetch top articles for each country/language
          for (const [country, language] of Object.entries(countryLanguageMapping)) {
            const topArticle = await fetchTopArticle(language);
            topArticlesByCountry[country] = topArticle.article;
          }

          // Add markers with popups for each country
          const countries = [
            { name: 'Brazil', lat: -14.2350, lng: -51.9253 },
            { name: 'USA', lat: 37.0902, lng: -95.7129 },
            { name: 'South Africa', lat: -30.5595, lng: 22.9375 },
            { name: 'Australia', lat: -25.2744, lng: 133.7751 },
            { name: 'France', lat: 46.6034, lng: 1.8883 },
            { name: 'India', lat: 20.5937, lng: 78.9629 },
            { name: 'Vietnam', lat: 14.0583, lng: 108.2772 },
          ];

          countries.forEach((country) => {
            const article = topArticlesByCountry[country.name];
            if (article) {
              const marker = L.marker([country.lat, country.lng]).addTo(map);

              marker.on('mouseover', function () {
                marker.bindPopup(`<strong>${country.name}</strong><br>Top Article: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(article)}" target="_blank">${article}</a>`).openPopup();
              });

              marker.on('mouseout', function () {
                marker.closePopup();
              });
            }
          });
        }
      });

      return {
        mapContainer,
      };
    },
  });
  </script>

  <style scoped>
  .map-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
  }
  </style>
