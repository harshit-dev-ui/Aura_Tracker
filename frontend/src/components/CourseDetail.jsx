import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams();

  const initialCourseDetails = {
    '1': {
      name: 'Introduction to Psychology',
      modules: [
        { title: 'Module 1', topics: [{ title: 'Topic 1.1', completed: false }, { title: 'Topic 1.2', completed: false }] },
        { title: 'Module 2', topics: [{ title: 'Topic 2.1', completed: false }, { title: 'Topic 2.2', completed: false }] }
      ],
      progress: 0,
    },
    '2': {
      name: 'Calculus I',
      modules: [
        { title: 'Module 1', topics: [{ title: 'Topic 1.1', completed: false }, { title: 'Topic 1.2', completed: false }, { title: 'Topic 1.3', completed: false }] },
        { title: 'Module 2', topics: [{ title: 'Topic 2.1', completed: false }, { title: 'Topic 2.2', completed: false }] },
        { title: 'Module 3', topics: [{ title: 'Topic 3.1', completed: false }] }
      ],
      progress: 0,
    },
    '3': {
      name: 'Computer Science Basics',
      modules: [
        { title: 'Module 1', topics: [{ title: 'Topic 1.1', completed: false }, { title: 'Topic 1.2', completed: false }] },
        { title: 'Module 2', topics: [{ title: 'Topic 2.1', completed: false }, { title: 'Topic 2.2', completed: false }] },
        { title: 'Module 3', topics: [{ title: 'Topic 3.1', completed: false }, { title: 'Topic 3.2', completed: false }] },
        { title: 'Module 4', topics: [{ title: 'Topic 4.1', completed: false }] }
      ],
      progress: 0,
    },
  };

  const [course, setCourse] = useState(initialCourseDetails[courseId]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [activeModuleIndex, setActiveModuleIndex] = useState(null);
  const [collapsedModules, setCollapsedModules] = useState(
    course.modules.map(() => true)
  );

  const handleTopicCompletion = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].completed = !updatedModules[moduleIndex].topics[topicIndex].completed;

    setCourse({ ...course, modules: updatedModules });

    const totalTopics = updatedModules.reduce((acc, mod) => acc + mod.topics.length, 0);
    const completed = updatedModules.reduce((acc, mod) => acc + mod.topics.filter(topic => topic.completed).length, 0);
    const progress = (completed / totalTopics) * 100;

    setCourse(prev => ({ ...prev, progress }));
  };

  const addModule = () => {
    if (newModuleTitle) {
      setCourse(prev => ({
        ...prev,
        modules: [...prev.modules, { title: newModuleTitle, topics: [] }]
      }));
      setNewModuleTitle('');
      setCollapsedModules([...collapsedModules, true]);
    }
  };

  const addTopic = (moduleIndex) => {
    if (newTopicTitle) {
      const updatedModules = [...course.modules];
      updatedModules[moduleIndex].topics.push({ title: newTopicTitle, completed: false });
      setCourse({ ...course, modules: updatedModules });
      setNewTopicTitle('');
      setActiveModuleIndex(null); 
    }
  };

  const toggleModuleCollapse = (index) => {
    const updatedCollapseState = [...collapsedModules];
    updatedCollapseState[index] = !updatedCollapseState[index];
    setCollapsedModules(updatedCollapseState);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-700">{course?.name}</h2>
      <p className="text-sm text-gray-600">Progress: {course?.progress.toFixed(0)}%</p>
      <div className="bg-gray-200 rounded-full h-2.5 mt-1">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course?.progress}%` }}></div>
      </div>
      <h3 className="mt-4 font-semibold">Modules</h3>


      <div className="mt-4">
        <input
          type="text"
          placeholder="New Module Title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button onClick={addModule} className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
          Add Module
        </button>
      </div>

      <ul className="divide-y divide-gray-200 mt-2">
        {course?.modules.map((module, moduleIndex) => (
          <li key={moduleIndex} className="py-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold cursor-pointer" onClick={() => toggleModuleCollapse(moduleIndex)}>
                {module.title} {collapsedModules[moduleIndex] ? '▼' : '▲'}
              </h4>
            </div>
            {!collapsedModules[moduleIndex] && (
              <ul className="pl-4">
                {module.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="py-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={topic.completed}
                      onChange={() => handleTopicCompletion(moduleIndex, topicIndex)}
                      className="mr-2"
                    />
                    <span className={`${topic.completed ? 'line-through text-gray-400' : ''}`}>{topic.title}</span>
                  </li>
                ))}

                {activeModuleIndex === moduleIndex ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="New Topic Title"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                    <button onClick={() => addTopic(moduleIndex)} className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
                      Add Topic
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setActiveModuleIndex(moduleIndex)} className="text-blue-500 mt-2">
                    Add Topic
                  </button>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetail;
