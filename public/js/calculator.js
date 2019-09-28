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

function del(e) {
    if(document.getElementsByClassName("activity").length > 1) {
        e.target.parentElement.parentElement.remove();
    }else {
        alert("Can't delete last activity")
    }
}
function dup(e) {
    let me  = e.target.parentElement.parentElement;

        w = me.getElementsByClassName("weight_input")[0];
        g = me.getElementsByClassName("grade_input");
        p = me.getElementsByClassName("percent");
        n = me.getElementsByClassName("name");


     me.insertAdjacentHTML("afterend",
         "<tr class='activity'><td>"+
                    "<input class='name' value='"+n[0].value+"' placeholder='My Activity' ><br>"+
                    "<button class='a_button'>DELETE</button>"+
                    "<button class='a_button'>DUPLICATE</button>"+
                "</td>"+
                "<td><input class='name' STYLE='width: 90px' value='"+n[1].value+"' placeholder='A' ></td>"+
                "<td><input class='weight_input' value='"+w.value+"'></td>"+
                "<td><input class='grade_input' value='"+g[0].value+"' >/ <br> <input class='grade_input' value='"+g[1].value+"'></td>"+
                "<td><span class='percent'>"+p[0].innerHTML+"</span></td>"+
            "</tr>"
     );
    let clone = me.nextElementSibling;

    setup_activity(clone);
    console.log(me.innerHTML)
    console.log(me);
    console.log(clone);
    // parent = me.parentElement;
    // parent.insertAdjacentHTML(me.innerHTML)
    // parent.appendChild(me);
}

function setup_activity(a) {
    w = a.getElementsByClassName("weight_input")[0];
    g = a.getElementsByClassName("grade_input");
    p = a.getElementsByClassName("percent");
    n = a.getElementsByClassName("name");
    w.onkeypress = num_only;
    g[0].onkeypress = num_only;
    g[1].onkeypress = num_only;
    g[0].addEventListener('input', gchange );
    g[1].addEventListener('input', gchange );


    b = a.getElementsByClassName("a_button");
    console.log(b)
    b[0].onclick = del;
    b[1].onclick = dup;


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
    let is_nans = false;
    for (let i = 0 ; i < a.length; i ++) {
        let w = a[i].getElementsByClassName("weight_input")[0];
        let g = a[i].getElementsByClassName("grade_input");
        let p = a[i].getElementsByClassName("percent")[0];

        let weight = parseFloat(w.value);
        let percent = calc_percent(g);

        p.innerHTML = parseFloat(Number(percent).toFixed(3)) + '%';
        if(isNaN(weight)){
            weight=0;
            is_nans = true
        }
        if(isNaN(percent)) {
            percent = 0;
            is_nans = true
        }

        totalp += percent*weight;
        totalw += weight;

    }

    wp = totalp/totalw;
    if(isNaN(wp)) {
        wp = 0;
        is_nans = true
    }

    res = document.getElementById('results');
    res.innerHTML =  parseFloat(Number(wp).toFixed(3)) + '%';
    if(is_nans) {
        res.innerHTML = res.innerHTML + "<span style='color: grey; font-size: small'> Note: some values were missing/NaN those have been assumed 0</span>"
    }

};

let bm =  document.getElementById('btn_m');
bm.onclick = function () {
    let a = document.getElementsByClassName("activity");
    let totalp = 0;
    let is_nans = false;

    for (let i = 0 ; i < a.length; i ++) {
        let g = a[i].getElementsByClassName("grade_input");
        let p = a[i].getElementsByClassName("percent")[0];

        let percent = calc_percent(g);
        p.innerHTML = parseFloat(Number(percent).toFixed(3)) + '%';




         if(isNaN(percent)) {
            percent = 0;
            is_nans = true
        }
        totalp += percent;

    }
    wp = totalp/a.length;
    res = document.getElementById('results');
    res.innerHTML =  parseFloat(Number(wp).toFixed(3)) + '%';
    if(is_nans) {
        res.innerHTML = res.innerHTML + "<span style='color: grey; font-size: small'> Note: some values were missing/NaN those have been assumed 0</span>"
    }
};

// ba = document.getElementById('btn_a');
// ba.onclick = function (e) {
//
// }
