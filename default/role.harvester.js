var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

         var target = Game.getObjectById(creep.memory.target);
        // find a enery source and stick to it until the creep is destroyed
        if(creep.carry.energy < creep.carryCapacity) {
           creep.moveTo(target);
           creep.harvest(target);
        }
        else {
            for(const resourceType in creep.carry) {
            creep.drop(resourceType);
            }
        }
    }
};

module.exports = roleHarvester;
