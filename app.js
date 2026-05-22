const map = L.map('map', {
  preferCanvas: true
}).setView([39.5, -98.35], 4);

L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
    updateWhenIdle: true
  }
).addTo(map);


//Cloudflare worker proxy because CORS
const API_URL =
  'https://cold-limit-e359.jakebutler.workers.dev/';


async function loadPourpoints() {

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    const layer = L.geoJSON(data, {

      pointToLayer: function(feature, latlng) {

        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: '#0077ff',
          color: '#ffffff',
          weight: 1,
          fillOpacity: 0.8
        });
      },

      onEachFeature: function(feature, layer) {

        const props = feature.properties || {};

        let html = '<div>';

        for (const [key, value] of Object.entries(props)) {
          html += `<b>${key}</b>: ${value}<br>`;
        }

        html += '</div>';

        layer.bindPopup(html);
      }

    }).addTo(map);

    map.fitBounds(layer.getBounds(), {
      padding: [20, 20]
    });

  } catch (err) {

    console.error(err);

    alert(
      'Failed to load pourpoints.\n' +
      'You may need a CORS proxy.'
    );
  }
}

loadPourpoints();
