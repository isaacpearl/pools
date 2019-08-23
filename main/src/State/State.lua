print("\tuploading State.lua")
function hasPools() 
	print("Pools state script status requested")
	_c.tell('pools') 
end
local nextDrop = function(event)
	local prevIndex = event.i
	_c.tell("i", event.id, prevIndex)
	event.i = event.b(event.i, event.pool)
	return event.pool.drops[prevIndex]
end
function createASL(e)
	print("createASL()")
	local toDo = {}
	for k, v in pairs(e) do
		table.insert(toDo, v.func(function() return nextDrop(v) end, 0.5))
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
