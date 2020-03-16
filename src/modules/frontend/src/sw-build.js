const workboxBuild = require("workbox-build");

const buildSW = () => {
    return workboxBuild.injectManifest({
        swSrc: "src/modules/frontend/src/sw.js", // custom sw rule
        swDest: "build/sw.js", // sw output file (auto-generated
        globDirectory: "build",
        globPatterns: ["**/*.{js,css,html,svg}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
    })
        .then(({ count, size, warnings, ...other }) => {
            warnings.forEach(console.warn);
            console.info(`${count} files will be precached, 
                  totaling ${size / (1024 * 1024)} MBs.`);
        });
};

buildSW();