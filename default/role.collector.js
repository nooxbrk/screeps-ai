/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('role.collector');
* mod.thing == 'a thing'; // true
*/

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity / 2) {
      const target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
      if(target) {
        if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
          creep.pickup(target);
        }
      }

    } else {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
  }

};
