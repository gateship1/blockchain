#[=[ testing blockchain backend C++ engine #]=]

# *************************************************************************** #
#                            TESTING FUNCITONS
# *************************************************************************** #
#[=====[ Traditional Unit Testing with DocTest  #]=====]
macro(define_unit_test TEST_NAME TEST_DESCRIPTION ${SOURCE_LIST})
    add_executable(${TEST_NAME} ${SOURCE_LIST})
    set_target_properties(${TEST_NAME} PROPERTIES LINKER_LANGUAGE CXX)
    target_include_directories(${TEST_NAME}
                               PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/cppsrc
                               PUBLIC ${DOCTEST_INCLUDE_DIR}
                               PRIVATE "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/cppsrc>"
    )
    add_test(NAME ${TEST_DESCRIPTION} COMMAND ${TEST_NAME})
endmacro()

function(test_code ${SOURCE_LIST})
    message(STATUS "test_code: ${PROJECT_NAME}")
    message(STATUS "ENABLE TESING: " True)
    add_definitions(-DENABLE_TESTS)
    if (ENABLE_LONG_TESTS)
        add_definitions(-DENABLE_LONG_TESTS)
    endif()
    # define tests
    enable_testing()
    #[== standard testing w/ Doctest #]==]
    define_unit_test(unittest
                     "Unit Testing w/ Doctest" 
                     ${SOURCE_LIST}
    )
endfunction()

set(SOURCE_LIST 
    ${CMAKE_CURRENT_SOURCE_DIR}/../cppsrc/sha256.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/../cppsrc/sha256.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/../cppsrc/unittest.hpp
)

test_code(${SOURCE_LIST}) # test the code