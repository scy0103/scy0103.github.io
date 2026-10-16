# CY (Jacob) Song — hook-up piping portfolio

Scroll-driven 3D portfolio built with Vite and three.js.

- **Project A**: a Revit CESS supply model, exported to IFC and converted with IfcOpenShell (`pipeline/`).
  Names, tags, properties and site coordinates are stripped before packaging; the published model is a meshopt-compressed GLB.
- **Project B**: a fab hook-up hall generated procedurally in `src/projectB.js`. It is not client geometry.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```
