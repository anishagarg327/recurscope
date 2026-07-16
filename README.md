# Recurscope - Scalable Visual Debugger & Recursion explorer

Recurscope is a high-fidelity visual time-travel debugger framework designed to explore and visualize complex recursive algorithms.

---

## Folder Architecture

```
recurscope/
├── README.md                 # Framework architecture and developer reference
├── src/
│   ├── core/                 # Decoupled logic engines and protocols
│   │   ├── execution/        # Execution states, types, and dynamic stats
│   │   ├── recorder/         # RecursionRecorder snapshot registration
│   │   ├── debugger/         # Replay session time-travel controllers
│   │   └── services/         # AlgorithmRegistry provider
│   ├── algorithms/           # Plug-and-play recursive algorithm registry
│   │   ├── factorial/        # Simulation and metadata bundle
│   │   ├── fibonacci/        # Simulation loader
│   │   └── binarySearch/     # Simulation loader
│   ├── contexts/             # Separated React providers (Execution, Playback, Settings, Algorithms)
│   ├── components/           # Custom reusable widgets
│   │   ├── panels/           # Generic visual panels (CodeEditor, Timeline, Tree, Stack)
│   │   ├── Navbar.jsx        # Top headers and algorithm selection
│   │   └── Sidebar.jsx       # Playground configuration menus
│   ├── hooks/                # Reusable state and key binding utilities
│   ├── utils/                # General formatting helper tools
│   ├── App.jsx               # App wrapper mounting layout columns
│   ├── main.jsx              # DOM entrypoint
│   └── App.css               # Color palettes and global class overrides
```

---

## Architecture Design

### 1. Execution Engine
The **Execution Engine** is responsible for compiling step-by-step snapshot traces from JavaScript algorithms. It manages state snapshots containing line numbers, active frames, variable scope updates, and recursion tree nodes and edges coordinates.

### 2. Recursion Recorder
The [RecursionRecorder](file:///d:/recurscope/src/core/recorder/RecursionRecorder.js) acts as an instrumented recording device. Developers can build secure client-side simulations of recursive algorithms that invoke:
- `recorder.recordCall(...)` on entry/line execution.
- `recorder.recordBaseCase(...)` when a base condition is hit.
- `recorder.recordReturn(...)` when a frame resolves.
- `recorder.finish()` when execution completes.

The recorder builds a fully synchronized immutable trace session automatically.

### 3. Replay Engine & Debugger Controller
Replay operations are decoupled from React components. Replay events coordinate movements:
- **Next / Previous Step**: Stepping forward/backward through snapshots.
- **Bookmarks**: Registering marker indices on the timeline.
- **Playback Speed**: Multiplier-based timeline timers.
- **Hotkeys**: Global keyboard bindings (`Space`, `Home`, `End`, arrow keys, `r`).

### 4. Algorithm Registry
The [AlgorithmRegistry](file:///d:/recurscope/src/core/services/AlgorithmRegistry.js) provides a self-registering mechanism:
- Adding a new algorithm requires zero changes to the visual dashboard or context engines.
- Developers place a new subfolder in `src/algorithms/` exporting `id`, `name`, `complexity`, `sourceCode` (plain text), and a `run()` driver.
- The Navbar dropdown automatically updates.

---

## Future Roadmap

1. **JavaScript AST Instrumentation**: Integrate an AST parser to instrument arbitrary user code automatically on the client side, bypassing manual simulation runners.
2. **Pan and Zoom Engine Extensions**: Enable interactive mouse-wheel zooming and touch-gesture panning on the recursion tree canvas.
3. **MiniMap Visual Overlay**: Render a small thumbnail overlay of large trees in the visualizer card to track active paths in deep recursion graphs.
4. **Animated SVG Node Transitions**: Add soft transitions when SVG tree coordinates are generated.
