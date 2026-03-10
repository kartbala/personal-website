#!/bin/bash
# Fetch Amtrak route and station data from ArcGIS Hub
# Source: https://hub.arcgis.com (Amtrak FeatureServer)
cd "$(dirname "$0")"

echo "Fetching Amtrak routes..."
curl -s "https://services2.arcgis.com/aIrBD8yn1TDTEXoz/arcgis/rest/services/Amtrak/FeatureServer/1/query?where=1%3D1&outFields=name&f=geojson&resultRecordCount=1000" > routes_raw.geojson

echo "Simplifying route geometries..."
python3 -c "
import json
with open('routes_raw.geojson') as f:
    d = json.load(f)
def simplify(coords, tol=0.005):
    if len(coords) < 3: return coords
    result = [coords[0]]
    for i in range(1, len(coords)-1):
        dx, dy = coords[i][0]-result[-1][0], coords[i][1]-result[-1][1]
        if dx*dx+dy*dy > tol*tol: result.append(coords[i])
    result.append(coords[-1])
    return result
def rnd(coords): return [[round(c,4) for c in pt] for pt in coords]
for feat in d['features']:
    g = feat['geometry']
    if g['type']=='MultiLineString':
        g['coordinates'] = [rnd(simplify(l)) for l in g['coordinates']]
    elif g['type']=='LineString':
        g['coordinates'] = rnd(simplify(g['coordinates']))
with open('routes.geojson','w') as f:
    json.dump(d, f, separators=(',',':'))
"
rm routes_raw.geojson

echo "Fetching Amtrak stations..."
curl -s "https://services2.arcgis.com/aIrBD8yn1TDTEXoz/arcgis/rest/services/Amtrak/FeatureServer/0/query?where=1%3D1&outFields=Name,Code,City,State&f=geojson&resultRecordCount=1000" > stations.geojson

echo "Done. Files: routes.geojson ($(wc -c < routes.geojson) bytes), stations.geojson ($(wc -c < stations.geojson) bytes)"
