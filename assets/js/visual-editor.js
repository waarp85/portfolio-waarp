
(function () {
    // Create the editor container
    const editor = document.createElement('div');
    editor.id = 'visual-editor-panel';
    editor.style.position = 'fixed';
    editor.style.bottom = '20px';
    editor.style.right = '20px';
    editor.style.width = '300px';
    editor.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    editor.style.border = '1px solid #333';
    editor.style.borderRadius = '8px';
    editor.style.padding = '20px';
    editor.style.fontFamily = "'Inter', sans-serif";
    editor.style.color = '#fff';
    editor.style.zIndex = '999999';
    editor.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    editor.style.display = 'flex';
    editor.style.flexDirection = 'column';
    editor.style.gap = '15px';

    // Title
    const title = document.createElement('h3');
    title.innerText = 'Visual Editor 🎨';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '14px';
    title.style.textTransform = 'uppercase';
    title.style.borderBottom = '1px solid #333';
    title.style.paddingBottom = '10px';
    editor.appendChild(title);

    // Function to create control group
    function createControl(label, input) {
        const group = document.createElement('div');
        group.style.display = 'flex';
        group.style.justifyContent = 'space-between';
        group.style.alignItems = 'center';

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.style.fontSize = '12px';
        labelEl.style.color = '#888';

        group.appendChild(labelEl);
        group.appendChild(input);
        return group;
    }

    // 1. Text Edit Toggle
    const editToggle = document.createElement('input');
    editToggle.type = 'checkbox';
    editToggle.onchange = (e) => {
        document.body.contentEditable = e.target.checked;
        document.body.style.cursor = e.target.checked ? 'text' : 'default';
    };
    editor.appendChild(createControl('Edit Text Content', editToggle));

    // 2. Background Color
    const bgColor = document.createElement('input');
    bgColor.type = 'color';
    bgColor.value = '#000000';
    bgColor.oninput = (e) => {
        document.documentElement.style.setProperty('--bg-color', e.target.value);
    };
    editor.appendChild(createControl('Background Color', bgColor));

    // 3. Text Color
    const textColor = document.createElement('input');
    textColor.type = 'color';
    textColor.value = '#ffffff';
    textColor.oninput = (e) => {
        document.documentElement.style.setProperty('--text-color', e.target.value);
    };
    editor.appendChild(createControl('Text Color', textColor));

    // 4. Font Selector
    const fontSelect = document.createElement('select');
    fontSelect.style.backgroundColor = '#222';
    fontSelect.style.color = '#fff';
    fontSelect.style.border = '1px solid #444';
    fontSelect.style.padding = '5px';
    fontSelect.style.borderRadius = '4px';

    const fonts = [
        { name: 'Inter (Default)', value: "'Inter', sans-serif" },
        { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
        { name: 'Serif (Times)', value: "'Times New Roman', serif" },
        { name: 'Arial', value: "Arial, sans-serif" },
        { name: 'Courier New', value: "'Courier New', monospace" }
    ];

    fonts.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.value;
        opt.innerText = f.name;
        fontSelect.appendChild(opt);
    });

    fontSelect.onchange = (e) => {
        document.documentElement.style.setProperty('--font-main', e.target.value);
    };
    editor.appendChild(createControl('Main Font', fontSelect));

    // Close Button (Small X)
    const closeBtn = document.createElement('div');
    closeBtn.innerText = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '20px';
    closeBtn.onclick = () => editor.style.display = 'none';
    editor.appendChild(closeBtn);

    // Initial minimized state (optional, here we show it full first)

    // Append to body
    document.body.appendChild(editor);

    console.log('Visual Editor Loaded');
})();
