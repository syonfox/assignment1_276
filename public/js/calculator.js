console.log("Start :)");


function calc_percent(g) {
    a = parseFloat(g[0].value);
    b = parseFloat(g[1].value);
    c = 100*a/b;

    return c;

}

function num_only(e) {
    obj = e.target;
// https://www.codeproject.com/Questions/732900/javascript-function-to-enter-only-numbers-and-deci
    var charCode = (e.which) ? e.which : event.keyCode;
    var value = obj.value;
            var dotcontains = value.indexOf(".") != -1;
            if (dotcontains)
                if (charCode == 46) return false;
            if (charCode == 46) return true;
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
}

function gchange(e) {

    console.log(e);
    let a = e.target.parentElement.parentElement;
    let g = a.getElementsByClassName("grade_input");
    let p = a.getElementsByClassName("percent")[0];

    let c = calc_percent(g);
    console.log(c)
    let s = parseFloat(Number(c).toFixed(3)) + '%';
    p.innerHTML = s;
}

function setup_activity(a) {
    w = a.getElementsByClassName("weight_input")[0];
    g = a.getElementsByClassName("grade_input");
    p = a.getElementsByClassName("percent");

    w.onkeypress = num_only;
    g[0].onkeypress = num_only;
    g[1].onkeypress = num_only;
    g[0].addEventListener('input', gchange );
    g[1].addEventListener('input', gchange );


}

a = document.getElementsByClassName("activity");

for (i = 0 ; i < a.length; i ++) {
    console.log(i);
    setup_activity(a[i])

}

bw =  document.getElementById('btn_w');
bw.onclick = function () {
    let a = document.getElementsByClassName("activity");
    let totalp = 0;
    let totalw = 0;
    for (let i = 0 ; i < a.length; i ++) {
        let w = a[i].getElementsByClassName("weight_input")[0];
        let g = a[i].getElementsByClassName("grade_input");
        let p = a[i].getElementsByClassName("percent")[0];

        let weight = parseFloat(w.value);
        let percent = calc_percent(g);

        p.innerHTML = parseFloat(Number(percent).toFixed(3)) + '%';

        totalp += percent*weight;
        totalw += weight;

    }
    wp = totalp/totalw;
    res = document.getElementById('results');
    res.innerHTML =  parseFloat(Number(wp).toFixed(3)) + '%';
};

let bm =  document.getElementById('btn_m');
bm.onclick = function () {
    let a = document.getElementsByClassName("activity");
    let totalp = 0;
    for (let i = 0 ; i < a.length; i ++) {
        let g = a[i].getElementsByClassName("grade_input");
        let p = a[i].getElementsByClassName("percent")[0];

        let percent = calc_percent(g);
        p.innerHTML = parseFloat(Number(percent).toFixed(3)) + '%';

        totalp += percent;


    }
    wp = totalp/a.length;
    res = document.getElementById('results');
    res.innerHTML =  parseFloat(Number(wp).toFixed(3)) + '%';
};
