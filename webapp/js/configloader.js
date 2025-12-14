let cachedConfig = null;

export async function loadConfig() {
    if (cachedConfig) return cachedConfig;

    const res = await fetch("../js/config.json");
    cachedConfig = await res.json();
    return cachedConfig;
}