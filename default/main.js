var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCollector = require('role.collector');


module.exports.loop = function () {

    // Cleanup before doing anything else
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Memory.build = true;
    Memory.upgrade = true;

    // A List of all Energy Sources in the Room (currently limited to 1 Room)
    if (Memory.energy_sources.length < 1)
    {
        Game.rooms['W7N4'].find(FIND_SOURCES, {
            filter: function(object) {
                // add the found sources to our list with the occupied flag to false
                Memory.energy_sources.push([object, false, '', 0]);
            }

        });
    }

    /**
     * debug lines
     */
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
    console.log('Harvesters: ' + harvesters.length +
        ' | Collectors: ' + collectors.length +
        ' | Upgraders: ' + upgraders.length +
        ' | Builders: ' + builders.length);


    // find a place for the 4 Spawn Extensions relative to my spawn, will happen after the room controller is upgraded to level 2
    var pos = Game.spawns['Spawn1'].pos;
    Game.rooms[pos.roomName].createConstructionSite(pos.x, pos.y + 1, STRUCTURE_EXTENSION);
    Game.rooms[pos.roomName].createConstructionSite(pos.x, pos.y - 1, STRUCTURE_EXTENSION);
    Game.rooms[pos.roomName].createConstructionSite(pos.x + 1, pos.y, STRUCTURE_EXTENSION);
    Game.rooms[pos.roomName].createConstructionSite(pos.x - 1, pos.y, STRUCTURE_EXTENSION);



    /**
     * Creeps respawn logic
     */
    if(harvesters.length < Memory.energy_sources.length) {
        Memory.build = false;
        Memory.upgrade = false;
        // find a suitable energy source for the harvester
        for (var i = 0; i < Memory.energy_sources.length; i++)
        {
            if (Memory.energy_sources[i][1] === false)
            {
                var name = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'harvester', target : Memory.energy_sources[i][0].id});
                if (name != -6 && name != -4) {
                    Memory.energy_sources[i][2] = name;
                    console.log('A new Harvester is requested for a source!');
                    console.log(Memory.energy_sources[i][0].id);
                    Memory.energy_sources[i][1] = true;
                    break;
                }
                break;
            }
        }
    } else {
        if (collectors.length < (harvesters.length*2)) {
            if (collectors.length < harvesters) {
                Memory.build = false;
                Memory.upgrade = false;
            }
            else {
              Memory.build = false;
            }
            Game.spawns['Spawn1'].createCreep([CARRY, CARRY, MOVE, MOVE], undefined, {role: 'collector'});
            console.log('Trying to Spawn new Collector');
        }
        if (upgraders.length < 2 && collectors.length >=  harvesters.length*2) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, CARRY, MOVE], undefined, {role: 'upgrader'});
            console.log('Trying to Spawn new Upgrader');
        }
        if (builders.length < 1 && collectors.length >= harvesters.length*2){
            Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'builder'});
            console.log('Trying to Spawn new Builder');
        }
    }

  /* Check if the assigned are still alive */
    for (var i = 0; i < Memory.energy_sources.length; i++) {
        if (Game.creeps[Memory.energy_sources[i][2]] == undefined)
        {
            console.log("assigned creep died, set assigned to false");
            Memory.energy_sources[i][1] = false;
        }
    }

    for(var creepname in Game.creeps) {
        var creep = Game.creeps[creepname];

        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            if (Memory.upgrade) {
                roleUpgrader.run(creep);
            }
            else {
              console.log("upgrading is stopped");
            }
        }
        if (creep.memory.role === 'builder') {
            if (Memory.build) {
                roleBuilder.run(creep);
            }
            else {
                console.log("building is stopped");
            }
        }
        if (creep.memory.role === 'collector') {
            roleCollector.run(creep);
        }
    }
};
