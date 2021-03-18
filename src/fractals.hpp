// Preprocessor Directives
#ifndef FRACTALS
#define FRACTALS
#pragma once

// System Headers
#include <assimp/Importer.hpp>
#include <assimp/postprocess.h>
#include <assimp/scene.h>
#include <btBulletDynamicsCommon.h>
#include <glad/glad.h>
#include <glm/glm.hpp>
#include <glm/gtc/type_ptr.hpp>

// Reference: https://github.com/nothings/stb/blob/master/stb_image.h#L4
// To use stb_image, add this in *one* C++ source file.
//     #define STB_IMAGE_IMPLEMENTATION
#include <stb_image.h>

// Define Some Constants
const int mWidth = 1080;
const int mHeight = 1080;

const float rect_verts[] = {
    -1.0f, -1.0f, 0.0f,
    1.0f, 1.0f, 0.0f,
    -1.0f, 1.0f, -0.0f,
    1.0f, -1.0f, 0.0f
};

const unsigned int tri_indices[] = {
    0, 1, 2,
    0, 3, 1
};

#endif //~ Fractals Header
