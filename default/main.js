var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCollector = require('role.collector');
var dynamicSpawner = require('dynamic.spawner');

module.exports.loop = function () {

    // Cleanup before doing anything else
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    /**
     * Spawning Structures
     */
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
    const extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });

    if(extensions < 4) {
        // find a place for the 4 Spawn Extensions relative to my spawn, will happen after the room controller is upgraded to level 2
        var pos = Game.spawns['Spawn1'].pos;
        Game.rooms[pos.roomName].createConstructionSite(pos.x, pos.y + 1, STRUCTURE_EXTENSION);
    } else if (extensions) {

    }

    /**
     * Spawning Creeps
     */
    dynamicSpawner.run();
    dynamicSpawner.printDebug()

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
