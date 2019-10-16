// create table tokimon (
//     name VARCHAR (50) UNIQUE NOT NULL,
//     trainer VARCHAR (50) NOT NULL,
//     weight INT NOT NULL CHECK(weight >= 0) DEFAULT 0,
//     height INT NOT NULL CHECK(height >= 0) DEFAULT 0,
//     fight INT NOT NULL CHECK(fight >= 0) DEFAULT 0,
//     fly INT NOT NULL CHECK(fly >= 0) DEFAULT 0,
//     water INT NOT NULL CHECK(water >= 0) DEFAULT 0,
//     fire INT NOT NULL CHECK(fire >= 0) DEFAULT 0,
//     ice INT NOT NULL CHECK(ice >= 0) DEFAULT 0,
//     energy INT NOT NULL CHECK(energy >= 0) DEFAULT 0,
//     health INT NOT NULL CHECK(health >= 0) DEFAULT 100
// );


function validate_tokimon(t) {

    err = false;
    if (typeof t.name == "undefined" || t.name == "") {
        err = "Name Is Invalid!";

        ret = false;
    }
    if (typeof t.trainer == "undefined" || t.trainer == '') {
        t.trainer = "";
    }
    if (typeof t.weight == "undefined" || t.weight == '') {
        t.weight = 0;
    }
    if (typeof t.height == "undefined" || t.height == '') {
        t.height = 0;
    }
    if (typeof t.fly == "undefined" || t.fly == '') {
        t.fly = 0;
    }
    if (typeof t.fire == "undefined" || t.fire == '') {
        t.fire = 0;
    }
    if (typeof t.water == "undefined" || t.water == '') {
        t.water = 0;
    }
    if (typeof t.ice == "undefined" || t.ice == '') {
        t.ice = 0;
    }
    if (typeof t.energy == "undefined" || t.energy == '') {
        t.energy = 0;
    }
    if (typeof t.health == "undefined" || t.health == '') {
        t.health = 100;
    }


    return [err, t];

}

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


const {Pool} = require('pg');
console.log(process.env.DATABASE_URL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});


express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .use('/public', express.static('public'))
    .get('/calculator', (req, res) => res.render('pages/calculator'))
    .get('/db', async (req, res) => {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM test_table');
            const results = {'results': (result) ? result.rows : null};
            res.render('pages/db', results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .get('/tokimon', (req, res) => res.render('pages/tokimon'))
    .get('/tokimon/:name', async (req, res) => {

        let tokimon = {'name': req.params.name};
        let success = true;
        let error = null;
        let result = 0;
        console.log("START INFO ?????");

        console.log(tokimon);
        const client = await pool.connect();
        try {
            result = await client.query(`SELECT * FROM tokimon WHERE name = '${tokimon.name}';`);
        } catch (err) {
            console.error(err);
            success = false;
            error = err.code + " " + err.detail;
            // res.send("Error " + err);
        } finally {
            console.log("RES: " + result.rows);

            client.release();
        }
        console.log("DONE");
        const results = {
            'results': (result) ? result.rows : null,
            'success': success,
            'error': error,
            'tokimon': tokimon,
        };
        res.render('pages/tokimon_info', results)
    })
    .post('/add_tokimon', async (req, res) => {
        console.log('post');
        var name = req.body.t_name;
        var weight = req.body.t_weight;
        let result = 0;
        console.log("TEST\n\n");
        const client = await pool.connect();
        let success = true;
        let error = null;
        let tokimon = {
            'name': req.body.t_name, 'trainer': req.body.t_trainer,
            'weight': req.body.t_weight, 'height': req.body.t_height,
            'fly': req.body.t_fly, 'fire': req.body.t_fire, 'water': req.body.t_water,
            'energy': req.body.t_energy, 'ice': req.body.t_ice, 'health': req.body.t_health
        };
        console.log(tokimon);
        let isValid = true;
        [error, tokimon] = validate_tokimon(tokimon);
        console.log(tokimon);
        if (error == false) {
            try {
                result = await client.query(`INSERT INTO tokimon(name, trainer, weight, height, fly, fire, water, energy, ice, health) ` +
                    `values('${tokimon.name}','${tokimon.trainer}', ${tokimon.weight}, ${tokimon.height}, ${tokimon.fly}, ${tokimon.fire},` +
                    `${tokimon.water}, ${tokimon.energy}, ${tokimon.ice}, ${tokimon.health}); `
                );
            } catch (err) {
                console.error(err);
                success = false;
                error = err;
                // res.send("Error " + err);
            } finally {
                console.log("RES: " + result);
                client.release();
            }
        } else {
            success= false;
            console.log(error)
        }
        console.log("DONE");
        const results = {
            'results': (result) ? result.rows : null,
            'success': success,
            'error': error,
            'tokimon': tokimon
        };
        res.render('pages/tokimon', results);

    })
    .post('/find_tokimon', async (req, res) => {
        console.log('post');
        let result = 0;
        const client = await pool.connect();
        let success = true;
        let error = null;
        let tokimon = {'name': req.body.t_name};
        console.log("START");
        console.log(tokimon);

        try {
            result = await client.query(`SELECT * FROM tokimon WHERE name ~ '${tokimon.name}';`);
        } catch (err) {
            console.error(err);
            success = false;
            error = err;
            // res.send("Error " + err);
        } finally {
            console.log("RES: " + result.rows);

            client.release();
        }
        console.log("DONE");
        const results = {
            'results': (result) ? result.rows : null,
            'success': success,
            'error': error,
            'tokimon': tokimon,
            'query': tokimon.name
        };
        res.render('pages/all_tokimon', results);

    })


    .post('/tokimon_select', async (req, res) => {
        console.log('post');
        let result = 0;
        const client = await pool.connect();
        let success = true;
        let error = null;
        let tokimon = {'name': req.body.t_name};
        console.log("START");
        console.log(tokimon);

        try {
            result = await client.query(`SELECT * FROM tokimon WHERE name ~ '';`);
        } catch (err) {
            console.error(err);
            success = false;
            error = err;
            // res.send("Error " + err);
        } finally {
            console.log("RES: " + result.rows);

            client.release();
        }
        console.log("DONE");
        const results = {
            'results': (result) ? result.rows : null,
            'success': success,
            'error': error,
            'tokimon': tokimon,
            'fightResults': false
        };
        res.render('pages/fight_tokimon', results);

    })
      .post('/tokimon_fight', async (req, res) => {
        console.log('post');
        let result = 0;
        const client = await pool.connect();
        let success = true;
        let error = null;
        let t1 = {'name': req.body.t1_name};
        let t2 = {'name': req.body.t2_name};
        let tokimon = {'name': req.body.t_name};
        console.log("START");
        console.log(tokimon);

        try {
            result = await client.query(`SELECT * FROM tokimon WHERE name ~ '';`);
        } catch (err) {
            console.error(err);
            success = false;
            error = err;
            // res.send("Error " + err);
        } finally {
            console.log("RES: " + result.rows);
        }
        // let new_results = result.rows;
        // console.log(new_results);
        result.rows.forEach((r)=> {
              // console.log(r)
              if(r.name == t1.name) t1 = r;
              if(r.name == t2.name) t2 = r;
          });
          t1.damage = 0;
          t2.damage = 0;
          atks = ['fire', 'water', 'ice', 'energy'];
          for( a in atks) {
              d = t1[atks[a]] - t2[atks[a]];
              d = d/10;
              if(d < 0) {
                  t1.damage += d*-1;
              } else {
                  t2.damage += d;
              }
              console.log("Damage "+ atks[a]  + "  "+ d + "   t:"+t1.damage);
          }

          if(t2.health == 0) {
              t1.damage =0;
          }
          if(t1.health == 0) {
              t2.damage = 0;
          }


          var new_health = t1.health - t1.damage;
          console.log(new_health);

          if(new_health < 0) {
              t1.damage -= new_health;
              new_health = 0;
          }
          t1.health = new_health;
          new_health = t2.health - t2.damage;
          console.log(new_health);

          if(new_health < 0) {
              t2.damage -= new_health;
              new_health = 0;
          }
          t2.health = new_health;

          console.log(t1);
          console.log(t2);
          for (let r in result) {
              if(r.name == t1.name) r = t1;
              if(r.name == t2.name) r = t2;
          }
          try {
              var res1 = await client.query(`UPDATE tokimon SET health = ${t1.health} WHERE name = '${t1.name}'`);
              var res2 = await client.query(`UPDATE tokimon SET health = ${t2.health} WHERE name = '${t2.name}'`);

          } catch (err) {
              console.log("UPDATE HEALTH ERROR")
              console.error(err);
              success = false;
              error = err;
          } finally {
              client.release();
          }


        console.log("DONE");
        const results = {
            'results': (result) ? result.rows : null,
            'success': success,
            'error': error,
            'tokimon': tokimon,
            'fightResults': true,
            't1': t1,
            't2': t2,
        };
        res.render('pages/fight_tokimon', results);

    })


    .post('/delete_tokimon', async (req, res) => {
        console.log('post');
        let result = 0;
        const client = await pool.connect();
        let success = true;
        let error = null;
        let tokimon = {'name': req.body.t_name};
        let query = req.body.query
        console.log("START");
        console.log(tokimon);

        try {
            result = await client.query(`DELETE FROM tokimon WHERE name = '${tokimon.name}';`);
            result = await client.query(`SELECT * FROM tokimon WHERE name ~ '${query}';`);
        } catch (err) {
            console.error(err);
            success = false;
            error = err;
            // res.send("Error " + err);
        } finally {
            console.log("RES: " + result.rows);

            client.release();
        }
        console.log("DONE");
        const results = {
            'results': (result) ? result.rows : null,
            'success': success,
            'error': error,
            'tokimon': tokimon,
            'query': query,
            'del': true
        };
        res.render('pages/all_tokimon', results);

    })

    .post('/edit_tokimon/:name', async (req, res) => {
        console.log('post');
        let result = 0;
        const client = await pool.connect();
        let success = true;
        let error = null;
        console.log(req.body);

        let tokimon = {
            'name': req.params.name, 'trainer': req.body.t_trainer,
            'weight': req.body.t_weight, 'height': req.body.t_height,
            'fly': req.body.t_fly, 'fire': req.body.t_fire, 'water': req.body.t_water,
            'energy': req.body.t_energy, 'ice': req.body.t_ice, 'health': req.body.t_health
        };
        console.log("EDIT ");
        console.log(tokimon)
        let isValid = true;
        [error, tokimon] = validate_tokimon(tokimon);
       // trainer'${tokimon.trainer}', ${tokimon.weight}, ${tokimon.height}, ${tokimon.fly}, ${tokimon.fire},` +
       //      `${tokimon.water}, ${tokimon.energy}, ${tokimon.ice}, ${tokimon.health
        console.log(tokimon)
        console.log(error)
        try {
            result = await client.query(`UPDATE tokimon SET 
            trainer ='${tokimon.trainer}', 
            weight = ${tokimon.weight}, 
            height = ${tokimon.height}, 
            fly = ${tokimon.fly}, 
            fire = ${tokimon.fire},
            water = ${tokimon.water}, 
            energy = ${tokimon.energy}, 
            ice = ${tokimon.ice}, 
            health = ${tokimon.health}
            
            WHERE name = '${tokimon.name}'`);

            result = await client.query(`SELECT * FROM tokimon WHERE name = '${tokimon.name}';`);
        } catch (err) {
            console.error(err);
            success = false;
            error = err;
        } finally {
            client.release();
        }
        const results = {
            'results': (result) ? result.rows : null,
            'tokimon': tokimon,
            'success': success,
            'error': error};
        res.render('pages/tokimon_info', results);

    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
