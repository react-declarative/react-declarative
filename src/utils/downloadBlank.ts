export const downloadBlank = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    a.target = "_blank";
    document.body.appendChild(a);
    a.addEventListener('click', () => queueMicrotask(() => {
        URL.revokeObjectURL(url);
    }), {
        once: true,
    });
    a.click();
}

export default downloadBlank;
