#[=[ simulate a blockchain with backend C++ engine #]=]

add_executable(simulate_blockchain.x simulate.cpp)
target_link_libraries(simulate_blockchain.x PUBLIC blockchain_cpp)