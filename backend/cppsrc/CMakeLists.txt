#[=[ blockchain backend C++ engine #]=]

set(UPDATE_DISCONNECTED_IF_AVAILABLE "UPDATE_DISCONNECTED 1")

# unit testing w/ Doctest
macro(get_doctest)
    include(${PROJECT_SOURCE_DIR}/cmake_files/DownloadProject.cmake)
    download_project(PROJ               doctest
                     GIT_REPOSITORY     https://github.com/onqtam/doctest.git
                     GIT_TAG            master
                     ${UPDATE_DISCONNECTED_IF_AVAILABLE}
    )
    add_subdirectory(${doctest_SOURCE_DIR} ${doctest_BINARY_DIR})
    set(DOCTEST_INCLUDE_DIR ${doctest_SOURCE_DIR}/doctest CACHE INTERNAL "Path to include folder for doctest")
endmacro()
get_doctest()

# source list
set(ENGINE_SOURCE_LIST 
    ${CMAKE_CURRENT_SOURCE_DIR}/block.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/block.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/blockchain.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/blockchain.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/sha256.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/sha256.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/unittest.hpp    
)

# add source files to a library
add_library(blockchain_cpp SHARED ${ENGINE_SOURCE_LIST})

# set the library linker language
set_target_properties(blockchain_cpp PROPERTIES LINKER_LANGUAGE CXX)

# pass library
target_include_directories(blockchain_cpp 
                           PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} 
                                  ${DOCTEST_INCLUDE_DIR}
)
target_link_libraries(blockchain_cpp PUBLIC)


if (${CMAKE_BUILD_TYPE} MATCHES "Server")
        
    # C++ and Python bindings
    macro(get_pybind)
        include(${PROJECT_SOURCE_DIR}/cmake_files/DownloadProject.cmake)
        download_project(PROJ               pybind11
                         GIT_REPOSITORY     https://github.com/pybind/pybind11.git
                         GIT_TAG            master
                         ${UPDATE_DISCONNECTED_IF_AVAILABLE}
        )
        add_subdirectory(${pybind11_SOURCE_DIR} ${pybind11_BINARY_DIR})
        set(PYBIND11_INCLUDE_DIR ${pybind11_SOURCE_DIR}/include CACHE INTERNAL "Path to include folder for pybind11")
    endmacro()
    get_pybind()
    
    pybind11_add_module(blockbind SHARED ${ENGINE_SOURCE_LIST} ${CMAKE_CURRENT_SOURCE_DIR}/bindings.cpp)
    target_include_directories(blockbind 
                               PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} 
                                      ${DOCTEST_INCLUDE_DIR}
                                      ${PYBIND11_INCLUDE_DIR}
                                      $ENV{PYPATH}
    )
endif()
