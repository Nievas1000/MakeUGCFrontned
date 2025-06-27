import { format } from "date-fns";
import React, { useState } from "react";

function downloadTextFile(filename, text) {
  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default function StoryboardModal({
  scenes,
  screenshots,
  hookBody,
  inspirationDescription,
  inspirationUrl,
}) {
  const [inspirationDescriptionVideo, setInspirationDescription] = useState(
    "This is a brief description of the inpsiration video which was inputted as a foundational part of creating this brief for the editor."
  );
  const outputs = hookBody || {};
  const hooks = Object.entries(outputs).filter(([key]) =>
    key.startsWith("hook")
  );
  const bodies = Object.entries(outputs).filter(([key]) =>
    key.startsWith("body")
  );

  return (
    <div className="max-w-4xl w-full p-6 space-y-6 relative">
      <div className="bg-white p-6 rounded shadow-md mb-10">
        <h2 className="text-lg font-semibold mb-2">Project Overview</h2>
        <p className="text-sm text-gray-700 mb-4">
          Create a video sales letter with a testimonial for Brand Name,
          inspired by competitor and category-adjacent videos. It is essential
          that you adhere to the storyboard provided and ensure that all visual
          elements are aligned for this ad.
        </p>

        <ul className="space-y-2 text-sm text-gray-800">
          <li className="flex items-center gap-2">
            📅 <span>Due Date: {format(new Date(), "dd MMMM, yyyy")}</span>
          </li>
          <li className="flex items-center gap-2">
            🔗{" "}
            <span>
              Total Variations: {hooks.length * bodies.length} (combine{" "}
              {hooks.length} hooks & {bodies.length} bodies)
            </span>
          </li>
          <li className="flex items-center gap-2">📱 Platform: Meta</li>
          <li className="flex items-center gap-2">
            🎬 Desired video length: 25 - 40 seconds
          </li>
          <li className="flex items-center gap-2">
            💬 Overall creative tone: Authoritative
          </li>
        </ul>
      </div>
      {/* Top Section: Video Assets */}
      <div className="flex bg-white p-6 rounded shadow-md gap-6 items-start mb-10">
        {/* Texto descriptivo */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Inspiration Video</h2>
          <p className="text-sm text-gray-700 mb-4">
            {inspirationDescriptionVideo}
          </p>

          <h3 className="text-sm font-semibold text-green-700 mb-2">
            Why this video works
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              ✅ Point describing why the video works
            </li>
            <li className="flex items-center gap-2">
              ✅ Point describing why the video works
            </li>
            <li className="flex items-center gap-2">
              ✅ Point describing why the video works
            </li>
          </ul>

          <button
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition"
            onClick={() => setInspirationDescription(inspirationDescription)}
          >
            View Transcript
          </button>
        </div>

        {/* Video placeholder */}
        <div className="w-40 h-64 bg-gray-300 rounded overflow-hidden">
          <video
            src={inspirationUrl}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <section className="p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Your Video Assets</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-28 text-sm text-gray-700">
          {/* Body Variations */}
          {bodies.map(([key, text]) => (
            <div key={key} className="bg-white w-[140px] rounded shadow p-2">
              <div className="h-56 bg-gray-300 mb-2 rounded relative">
                <button
                  className="absolute bottom-2 left-2 text-gray-600 hover:text-black cursor-pointer"
                  onClick={() => downloadTextFile(`${key}.txt`, text)}
                  title="Download"
                >
                  ⬇️
                </button>
              </div>
              <p className="font-medium text-center capitalize">
                {key.replace("_", " ")}
              </p>
            </div>
          ))}

          {/* Hook Variations */}
          {hooks.map(([key, text]) => (
            <div key={key} className="bg-white w-[140px] rounded shadow p-2">
              <div className="h-56 bg-gray-300 mb-2 rounded relative">
                <button
                  className="absolute bottom-2 left-2 text-gray-600 hover:text-black cursor-pointer"
                  onClick={() => downloadTextFile(`${key}.txt`, text)}
                  title="Download"
                >
                  ⬇️
                </button>
              </div>
              <p className="font-medium text-center capitalize">
                {key.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Storyboard Section */}
      <section>
        <h2 className="text-2xl font-bold text-center">Story Board</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Adhere to the story board shots closely in line with the inspiration
          videos
        </p>

        <div className="space-y-8">
          {scenes.map((scene, index) => (
            <div key={index} className="flex gap-4 items-start">
              <img
                src={screenshots[index].image}
                alt={`Scene ${index + 1}`}
                className="w-52 h-72 object-cover rounded border"
              />

              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-500">
                  {scene.scene_number}
                </span>
                <h3 className="font-bold text-lg">{scene.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{scene.timestamp}</p>
                <p className="text-sm text-gray-700 mb-2">
                  {scene.description}
                </p>

                <p className="text-sm font-semibold text-gray-700">
                  Scene Tips
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {scene.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span role="img" aria-label="check">
                        ✅
                      </span>{" "}
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
