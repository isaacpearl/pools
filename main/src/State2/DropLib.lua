print("\trunning DropLib.lua")

function changeDropValue(pool, dropIndex, newValue)
	local poolCopy = pool
	poolCopy.drops[dropIndex] = newValue
	return poolCopy
end

function removeDrops(pool, toRemove)
	for k, v in pairs(toRemove) do
		for	key, val in pairs(pool.drops) do
			if val == v then
				table.remove(pool.drops, v)
			end
		end
	end
	return pool
end
function addDrops(pool, drops)
	for k, v in pairs(drops) do
		table.insert(pool, v)
	end
	return pool
end
