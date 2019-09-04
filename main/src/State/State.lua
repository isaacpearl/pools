print("\tuploading State.lua")

local nextDrop = function(event, argument)
	local prevIndex = event.args[argument].index
	local nextIndex = event.b(prevIndex, event.args[argument].pool)
	_c.tell("i", event.id, argument, nextIndex, prevIndex)
	event.args[argument].prevIndex = prevIndex
	event.args[argument].index = nextIndex 	
	return pools[event.args[argument].pool].drops[nextIndex] --function for this?
end

function createASL(e)
	print("createASL()")
	local toDo = {}
	for k, v in pairs(e) do
		table.insert(toDo, v.func( 
						function() return nextDrop(v, "destination") end
					,	function() return nextDrop(v, "time") end)
					)
	end
	return toDo
end
