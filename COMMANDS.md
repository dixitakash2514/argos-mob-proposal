# Dev Commands

## Start (development)

```bash
cd proposal-builder
npm run dev
```

App runs at: http://localhost:3000

---

## Stop

Press `Ctrl + C` in the terminal running the dev server.

---

## Start (production)

```bash
npm run build   # compile once
npm start       # serve the compiled build
```

---

## Check if something is already running on port 3000

```bash
lsof -i :3000
```

Kill it if needed:

```bash
kill -9 $(lsof -t -i :3000)
```
