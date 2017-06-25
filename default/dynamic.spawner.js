var dynamicSpawner = {

    run: function() {
        if(Memory.harvesters.length < Memory.energy_sources.length) {
            Memory.build = false;
            Memory.upgrade = false;
            // find a suitable energy source for the harvester
            for (var i = 0; i < Memory.energy_sources.length; i++)
            {
                if (Memory.energy_sources[i][1] === false)
                {
                    var name = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'harvester', target : Memory.energy_sources[i][0].id});
                    if (name !== -6 && name !== -4) {
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
            if (Memory.collectors.length < (Memory.harvesters.length*2)) {
                if (Memory.collectors.length < Memory.harvesters) {
                    Memory.build = false;
                    Memory.upgrade = false;
                }
                else {
                    Memory.build = false;
                }
                Game.spawns['Spawn1'].createCreep([CARRY, CARRY, MOVE, MOVE], undefined, {role: 'collector'});
                console.log('Trying to Spawn new Collector');
            }
            if (Memory.upgraders.length < 2 && Memory.collectors.length >=  Memory.harvesters.length*2) {
                Game.spawns['Spawn1'].createCreep([WORK, CARRY, CARRY, MOVE], undefined, {role: 'upgrader'});
                console.log('Trying to Spawn new Upgrader');
            }
            if (Memory.builders.length < 1 && Memory.collectors.length >= Memory.harvesters.length*2 && Memory.construction_sites.length > 0){
                Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, MOVE], undefined, {role: 'builder'});
                console.log('Trying to Spawn new Builder');
            }
        }
    },

    printDebug: function () {
        Memory.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        Memory.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        Memory.builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        Memory.collectors = _.filter(Game.creeps, (creep) => creep.memory.role === 'collector');
        Memory.construction_sites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        console.log('Harvesters: ' + Memory.harvesters.length +
            ' | Collectors: ' + Memory.collectors.length +
            ' | Upgraders: ' + Memory.upgraders.length +
            ' | Builders: ' + Memory.builders.length);

        Memory.build = true;
        Memory.upgrade = true;
    }

};

module.exports = dynamicSpawner;