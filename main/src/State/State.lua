print("\tuploading State.lua")

local nextDrop = function(event, argument)
	--print("nextDrop()")
	local a = event.args[argument]
	local prevIndex = a.index
	local nextIndex = a.behavior(prevIndex, a.pool)
	_c.tell("i", event.id, argument, nextIndex, prevIndex)
	a.prevIndex = prevIndex
	a.index = nextIndex
	return translate(pools[a.pool].drops[nextIndex], a.type)
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

function translate(value, type)
	local beat = 60/bpm --seconds of one beat in 4/4
	local tVal = value
	if type == "time" then
		tVal = math.abs(tVal)
		if value < 1 then
			tVal = 1 --prevents 0 time infinite loop for now, TODO add infinite hold on 0 until drop changes
		else
			tVal = 4 * (beat * (1/value))
		end
	end
	return tVal
end

function nearestValue(table, number)
    local smallestSoFar = -1
    for k, v in pairs(table) do
        if (math.abs(number-v) < smallestSoFar) then
            smallestSoFar = math.abs(number-v)
        end
    end
    return smallestSoFar
end
