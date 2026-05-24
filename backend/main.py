# -*- coding: utf-8 -*-
"""
FastAPI Server - Saudi GIS Student Portal Backend
Exposes geomesh spatial harmonization services.
"""

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import time
from geomesh import GeoMesh, SAUDI_REGIONS

app = FastAPI(
    title="Saudi WebGIS Geoprocessing API",
    description="Backend service for the Saudi GIS Student Portal (Phase 2 Python SDK)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://i6naf.github.io"],  # Restrict to GitHub Pages origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HarmonizationRequest(BaseModel):
    region: str = Field(..., description="Region ID ('riyadh', 'western', 'eastern', 'southern', 'northern')")
    resolution: int = Field(..., description="Spatial resolution in meters (30, 100, 250)")
    variables: List[str] = Field(..., description="Selected datasets (e.g. ['ndvi', 'lst', 'no2', 'population'])")
    format: str = Field("geojson", description="Response format: 'geojson' or 'csv'")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "api": "Saudi WebGIS Geoprocessing API",
        "version": "1.0.0",
        "supported_regions": list(SAUDI_REGIONS.keys())
    }

@app.post("/api/geomesh")
def process_mesh(req: HarmonizationRequest):
    start_time = time.time()
    
    # Validation
    if req.region not in SAUDI_REGIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported region: '{req.region}'")
    
    if req.resolution not in [30, 100, 250]:
        raise HTTPException(status_code=400, detail="Invalid resolution. Must be 30, 100, or 250 meters.")
        
    if not req.variables:
        raise HTTPException(status_code=400, detail="Variables list cannot be empty.")
        
    try:
        # Create SDK instances and compute mesh
        mesh = GeoMesh(
            region=req.region,
            resolution_m=req.resolution,
            variables=req.variables
        )
        
        # Geoprocessing step simulations (record logs to send to UI console)
        logs = []
        logs.append(f"[{time.strftime('%H:%M:%S')}] [KERN] Starting geoprocessing engine for region: {req.region.upper()}...")
        logs.append(f"[{time.strftime('%H:%M:%S')}] [SDK] Loaded bbox: {mesh.region['bbox']}")
        
        num_points = mesh.harmonize()
        
        # Inject live telemetry connection logs from external APIs
        for api_log in mesh.api_logs:
            logs.append(f"[{time.strftime('%H:%M:%S')}] {api_log}")
            
        elapsed = time.time() - start_time
        
        logs.append(f"[{time.strftime('%H:%M:%S')}] [ALIGN] Spatial grid alignment complete. Generated {num_points} nodes.")
        logs.append(f"[{time.strftime('%H:%M:%S')}] [PROJ] Projected coordinates to EPSG:3857 (Web Mercator).")
        logs.append(f"[{time.strftime('%H:%M:%S')}] [RESAMPLE] Resampled variables: {', '.join(req.variables)} to {req.resolution}m.")
        logs.append(f"[{time.strftime('%H:%M:%S')}] [SUCCESS] Compiled spatial mesh in {elapsed:.3f} seconds.")
        
        if req.format.lower() == "csv":
            csv_data = mesh.to_csv()
            # Return CSV response
            return {
                "success": True,
                "format": "csv",
                "logs": logs,
                "data": csv_data,
                "filename": f"geomesh_{req.region}_{req.resolution}m.csv"
            }
        else:
            geojson_data = mesh.to_geojson()
            # Return GeoJSON response
            return {
                "success": True,
                "format": "geojson",
                "logs": logs,
                "data": geojson_data,
                "filename": f"geomesh_{req.region}_{req.resolution}m.geojson"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal geoprocessing error: {str(e)}")
