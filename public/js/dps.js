document.getElementById("applyButton").addEventListener("click", function() {
    // Assume the values come from somewhere, form input for example.
    let maxDmg, critDmgBuff, attacks, decay, ammo;

    let avgDmg = maxDmg * 0.9 * 0.75;
    let avgCritDmg = 0.02 * ((maxDmg + avgDmg) * critDmgBuff) - avgDmg;

    let effectiveDmg = avgDmg + avgCritDmg;

    let dps = effectiveDmg * attacks;
    let dpp = effectiveDmg / (decay + ammo);

    document.getElementById("dpsResult").innerHTML = dps;
    document.getElementById("dppResult").innerHTML = dpp;
});