<script lang="ts">
    import { Canvas, T } from "@threlte/core";
    import { TransformControls } from "@threlte/extras";
    import { useNuiEvent } from "../utils/useNuiEvent";
    import {
        BufferGeometry,
        Material,
        MathUtils,
        Mesh,
        PerspectiveCamera,
        type NormalBufferAttributes,
        type Object3DEventMap,
        BoxGeometry,
        MeshStandardMaterial,
    } from "three";
    import { fetchNui } from "../utils/fetchNui";
    import { onMount } from "svelte";

    let mode: "translate" | "rotate" | "scale" = "translate";
    let space: "world" | "local" = "world";
    let object: number;

    let camPos: number[] = [0, 0, 0];
    let camRot: number[] = [0, 0, 0];

    let objPos: number[] = [0, 0, 0];
    let objRot: number[] = [0, 0, 0];

    let cam: PerspectiveCamera | undefined;
    let mesh:
        | Mesh<
              BufferGeometry<NormalBufferAttributes>,
              Material | Material[],
              Object3DEventMap
          >
        | undefined;
    interface objectData {
        object: number;
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number };
    }
    interface cameraData {
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number };
    }

    const zRotationHandler = (t: number, e: number) => {
        return t > 0 && t < 90 ? e : (t > -180 && t < -90) || t > 0 ? -e : e;
    };

    function updateCamera({ position, rotation }: cameraData) {
        camPos = [position.x, position.z, -position.y];
        if (cam === undefined) {
            return;
        }
        cam.rotation.order = "YZX";

        camRot = [
            MathUtils.degToRad(rotation.x),
            MathUtils.degToRad(zRotationHandler(rotation.x, rotation.z)),

            MathUtils.degToRad(rotation.y),
        ];
        cam.updateProjectionMatrix();
    }
    function updateMesh(objectData: objectData) {
        object = objectData.object;
        if (object === undefined) return;
        objPos = [
            objectData.position.x,
            objectData.position.z,
            -objectData.position.y,
        ];
        objRot = [
            MathUtils.degToRad(objectData.rotation.x),
            MathUtils.degToRad(objectData.rotation.z),
            MathUtils.degToRad(objectData.rotation.y),
        ];
    }

    useNuiEvent<cameraData>("setCameraPostion", (data) => {
        updateCamera(data);
    });

    useNuiEvent<objectData>("setTransformEntity", (objectData) => {
        updateMesh(objectData);
    });

    function handleObjectUpdate() {
        if (mesh === undefined) return;
        const newObject = {
            object: object,
            position: {
                x: mesh.position.x,
                y: -mesh.position.z,
                z: mesh.position.y,
            },
            rotation: {
                x: MathUtils.radToDeg(mesh.rotation.x),
                y: MathUtils.radToDeg(-mesh.rotation.z),
                z: MathUtils.radToDeg(mesh.rotation.y),
            },
        };

        fetchNui("moveObject", newObject);
    }

    onMount(() => {
        const keyHandler = async (e: KeyboardEvent) => {
            if (object === undefined) return;
            switch (e.code) {
                case "KeyR":
                    mode = "rotate";
                    fetchNui("updatePos", object);
                    break;
                case "KeyW":
                    mode = "translate";
                    fetchNui("updatePos", object);
                    break;
                case "KeyL":
                    if (space === "world") {
                        space = "local";
                    } else {
                        space = "world";
                    }
                    fetchNui("updatePos", object);
                    break;
                case "KeyQ":
                    fetchNui("updatePos", object);
                    break;
                case "Escape" || "Enter":
                    fetchNui("placeObject");
                    break;
                case "AltLeft":
                    await fetchNui("placeObjectOnGround", object);
                    break;
            }
        };

        window.addEventListener("keydown", keyHandler);

        return () => window.removeEventListener("keydown", keyHandler);
    });
</script>

{#if object !== undefined}
    <div class="absolute top-0 left-0 w-full h-full">
        <Canvas>
            <T.PerspectiveCamera
                makeDefault
                position={camPos}
                rotation={camRot}
                bind:ref={cam}
                on:update={({ ref }) => ref.updateProjectionMatrix()}
            />
            <T.Mesh let:ref position={objPos} rotation={objRot} bind:ref={mesh}>
                <!-- <T.BoxGeometry args={[1, 1, 1]} />
        <T.MeshBasicMaterial color="hotpink" /> -->
                <TransformControls
                    object={ref}
                    {space}
                    on:objectChange={handleObjectUpdate}
                    {mode}
                    rotationSnap={MathUtils.degToRad(22.5)}
                />
            </T.Mesh>
        </Canvas>
    </div>
{/if}
