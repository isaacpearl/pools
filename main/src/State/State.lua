print("\tuploading State.lua")

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
		print("v.func: "..tostring(v.func))
		table.insert(toDo, v.func( 
						function() return nextDrop(v, "destination") end
					,	function() return nextDrop(v, "time") end)
					)
	end
	return toDo
end
