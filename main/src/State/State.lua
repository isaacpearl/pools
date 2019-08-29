print("\tuploading State.lua")

function resetScript()
	hasPools = function() return end
	print("ready for new lua scripts - restart pools to upload :)")
end

hasPools = function() 
	print("Pools state script status requested")
	_c.tell('pools') 
end

local nextDrop = function(event, argument)
	local prevIndex = event.i
	_c.tell("i", event.id, argument, prevIndex)
	event.argument["index"] = event.b(event.i, event.argument["index"])
	return pools[event.argument["pool"]].drops[prevIndex]
end

function createASL(e)
	print("createASL()")
	local toDo = {}
	for k, v in pairs(e) do
		table.insert(toDo, v.func( function() return nextDrop(v, "destination") end, function() return nextDrop(v, "time") end ))
	end
	return toDo
end

function init()
	print("init()")
	for c=1, 4 do
        output[c]()
    end
end

function resetPools()
	print("resetting the state")
	_c.tell("reset_state")
	events = {}
	pools = {}
	for n=1,4 do 
		output[n](to(0)) 
	end
	init()
end
