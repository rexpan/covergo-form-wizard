
export const packages = [
    { id:"sd", packageName:"Standard"  , addRatio:0, },
    { id:"sf", packageName:"Safe"      , addRatio:.5 },
    { id:"ss", packageName:"Super Safe", addRatio:.75},
];

export const mPackage = new Map(packages.map(p => [p.id, p]));
